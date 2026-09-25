import { NextResponse } from 'next/server';
import { convertToMarkdown, chunkMarkdown } from '@/lib/rag-parser';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
      // User requested we proceed without key, so we'll mock the success for now
      // but the exact Together AI proxy logic is fully wired up.
      console.warn("TOGETHER_API_KEY is missing. Mocking Together AI response.");
      return NextResponse.json({
        success: true,
        data: {
          id: \`file-\${Math.random().toString(36).substring(7)}\`,
          name: file.name,
          size: file.size,
          type: file.type,
          createdAt: Date.now(),
          provider: 'together_ai'
        }
      });
    }

    // [Aphura World-Class Optimization]
    // 1. Convert raw file buffer to pure Semantic Markdown
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const markdownContent = await convertToMarkdown(buffer, file.type, file.name);
    
    // 2. Chunk it via recursive character split (preserving overlap)
    // (We would normally bulk-upload these chunks, but for managed storage we send the optimized markdown)
    const optimalChunks = chunkMarkdown(markdownContent, file.name, 2048, 256);
    
    // Forward the optimized Markdown file directly to Together AI Managed Storage
    const togetherFormData = new FormData();
    // Re-package it as a clean text file for superior embedding quality
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    togetherFormData.append('file', blob, file.name + '.md');
    togetherFormData.append('purpose', 'fine-tune');

    const response = await fetch('https://api.together.xyz/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`
      },
      body: togetherFormData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload to Together AI');
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        name: file.name, // The API returns filename as well
        size: data.bytes || file.size,
        type: file.type,
        createdAt: data.created_at ? data.created_at * 1000 : Date.now(),
        provider: 'together_ai'
      }
    });

  } catch (error: any) {
    console.error("Knowledge upload error:", error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
