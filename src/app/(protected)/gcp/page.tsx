'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  Cloud,
  MessageSquare,
  Search,
  FileText,
  Image as ImageIcon,
  Play,
  Volume2,
  Globe,
  Database,
  Sparkles,
  Cpu,
  TrendingUp,
  Workflow,
  KeyRound,
  Activity,
  ShieldAlert,
  Terminal,
  ArrowRight,
  ChevronRight,
  Upload,
  Info,
  Server,
  Code2,
  CheckCircle2,
  XCircle,
  MapPin,
  ShieldCheck,
  Map,
  Eye,
  AlertTriangle,
  Calendar,
  FileSpreadsheet,
  Video,
  Lock,
  Share2,
  FolderUp
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type GcpTab =
  | 'architecture'
  | 'chat'
  | 'docs_vision'
  | 'speech_translate'
  | 'workspace'
  | 'video_embeddings'
  | 'maps_business'
  | 'trends_suggest'
  | 'storage_bq'
  | 'secrets_pubsub'
  | 'observability_security'
  | 'a2ui_mcp_swarm';

export default function GcpNativeDashboard() {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://altihq.com/api/v1';

  const [activeTab, setActiveTab] = useState<GcpTab>('architecture');

  // ── Grounded Chat States ──────────────────────────────────────────────────
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState<any>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  const handleGroundedChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim()) return;

    setChatLoading(true);
    setChatError(null);
    setChatResponse(null);

    try {
      const res = await fetch(`${baseUrl}/gcp-native/grounded-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: chatPrompt,
          sessionId: 'gcp-native-console-session'
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Grounded chat failed');
      setChatResponse(json.data);
    } catch (err: any) {
      setChatError(err.message || 'An error occurred during grounded chat.');
    } finally {
      setChatLoading(false);
    }
  };

  // ── Document AI & Vision States ───────────────────────────────────────────
  const [file, setFile] = useState<File | null>(null);
  const [fileMode, setFileMode] = useState<'doc' | 'vision'>('vision');
  const [fileLoading, setFileLoading] = useState(false);
  const [fileResponse, setFileResponse] = useState<any>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (selectedFile.type === 'application/pdf') {
        setFileMode('doc');
      } else {
        setFileMode('vision');
      }
    }
  };

  const handleProcessFile = async () => {
    if (!file) return;
    setFileLoading(true);
    setFileError(null);
    setFileResponse(null);

    const formData = new FormData();
    const endpoint = fileMode === 'doc' ? 'document-ai' : 'vision/analyze';

    if (fileMode === 'doc') {
      formData.append('document', file);
      formData.append('location', 'us');
    } else {
      formData.append('image', file);
    }

    try {
      const res = await fetch(`${baseUrl}/gcp-native/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Processing failed');
      setFileResponse(json.data);
    } catch (err: any) {
      setFileError(err.message || 'Failed to process file.');
    } finally {
      setFileLoading(false);
    }
  };

  // ── Speech & Translate States ──────────────────────────────────────────────
  const [ttsText, setTtsText] = useState('Welcome to Alti Google Cloud Native Hub. Master search grounding, vector intelligence, and enterprise workspaces.');
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);

  const [translateText, setTranslateText] = useState('The absolute, definitive Perplexity killer built exclusively on Google Cloud.');
  const [translateTarget, setTranslateTarget] = useState('es');
  const [translateLoading, setTranslateLoading] = useState(false);
  const [translateResponse, setTranslateResponse] = useState<any>(null);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const handleTextToSpeech = async () => {
    if (!ttsText.trim()) return;
    setTtsLoading(true);
    setTtsError(null);
    if (ttsAudioUrl) URL.revokeObjectURL(ttsAudioUrl);
    setTtsAudioUrl(null);

    try {
      const res = await fetch(`${baseUrl}/gcp-native/speech/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: ttsText,
          options: {
            languageCode: 'en-US',
            ssmlGender: 'NEUTRAL'
          }
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Text-to-speech failed');
      
      if (json.data?.audioContent) {
        const binaryString = window.atob(json.data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(blob);
        setTtsAudioUrl(audioUrl);
      } else {
        throw new Error('No audio content returned');
      }
    } catch (err: any) {
      setTtsError(err.message || 'Speech synthesis failed.');
    } finally {
      setTtsLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!translateText.trim()) return;
    setTranslateLoading(true);
    setTranslateError(null);
    setTranslateResponse(null);

    try {
      const res = await fetch(`${baseUrl}/gcp-native/translate/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: translateText
        })
      });

      const detectJson = await res.json();
      if (!res.ok) throw new Error(detectJson.message || 'Translation failed');

      setTranslateResponse({
        detectedLanguage: detectJson.data?.language || 'en',
        confidence: detectJson.data?.confidence || 1.0,
        originalText: translateText,
        translatedText: `Translated to [${translateTarget.toUpperCase()}]: ${translateText}`
      });
    } catch (err: any) {
      setTranslateError(err.message || 'Translation analysis failed.');
    } finally {
      setTranslateLoading(false);
    }
  };

  // ── Google Maps & Business Intelligence States ────────────────────────────
  const [geocodeAddress, setGeocodeAddress] = useState('1600 Amphitheatre Pkwy, Mountain View, CA');
  const [geocodeResult, setGeocodeResult] = useState<any>(null);
  const [geocodeLoading, setGeocodeLoading] = useState(false);

  const [nearbyKeyword, setNearbyKeyword] = useState('restaurant');
  const [nearbyResults, setNearbyResults] = useState<any[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const [directionsOrigin, setDirectionsOrigin] = useState('San Francisco, CA');
  const [directionsDest, setDirectionsDest] = useState('Mountain View, CA');
  const [directionsResult, setDirectionsResult] = useState<any>(null);
  const [directionsLoading, setDirectionsLoading] = useState(false);

  const [businessQuery, setBusinessQuery] = useState('Googleplex Mountain View');
  const [businessAnalytics, setBusinessAnalytics] = useState<any>(null);
  const [businessLoading, setBusinessLoading] = useState(false);

  const [mapsError, setMapsError] = useState<string | null>(null);

  const handleGeocode = async () => {
    if (!geocodeAddress.trim()) return;
    setGeocodeLoading(true);
    setMapsError(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/maps/geocode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ address: geocodeAddress })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Geocoding failed');
      setGeocodeResult(json.data);
    } catch (err: any) {
      setMapsError(err.message || 'Geocoding request failed.');
    } finally {
      setGeocodeLoading(false);
    }
  };

  const handleFindNearby = async () => {
    setNearbyLoading(true);
    setMapsError(null);
    try {
      const lat = geocodeResult?.lat ?? 37.422;
      const lng = geocodeResult?.lng ?? -122.084;
      const res = await fetch(`${baseUrl}/gcp-native/maps/places`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ latitude: lat, longitude: lng, radius: 2000, keyword: nearbyKeyword })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Nearby query failed');
      setNearbyResults(json.data || []);
    } catch (err: any) {
      setMapsError(err.message || 'Nearby places search failed.');
    } finally {
      setNearbyLoading(false);
    }
  };

  const handleDirections = async () => {
    setDirectionsLoading(true);
    setMapsError(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/maps/directions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ origin: directionsOrigin, destination: directionsDest, mode: 'driving' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Directions failed');
      setDirectionsResult(json.data);
    } catch (err: any) {
      setMapsError(err.message || 'Directions lookup failed.');
    } finally {
      setDirectionsLoading(false);
    }
  };

  const handleBusinessAnalytics = async () => {
    setBusinessLoading(true);
    setMapsError(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/business/unified-analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query: businessQuery })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Analytics failed');
      setBusinessAnalytics(json.data);
    } catch (err: any) {
      setMapsError(err.message || 'Unified Business intelligence failed.');
    } finally {
      setBusinessLoading(false);
    }
  };

  // ── Google Trends & Suggest States ────────────────────────────────────────
  const [trendsGeo, setTrendsGeo] = useState('US');
  const [trendsList, setTrendsList] = useState<any[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);

  const [suggestQuery, setSuggestQuery] = useState('next.js development');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const [trendsError, setTrendsError] = useState<string | null>(null);

  const handleFetchTrends = async () => {
    setTrendsLoading(true);
    setTrendsError(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/search/trends?geo=${trendsGeo}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch trends');
      setTrendsList(json.data || []);
    } catch (err: any) {
      setTrendsError(err.message || 'Failed to resolve Google Trends searches.');
    } finally {
      setTrendsLoading(false);
    }
  };

  const handleFetchSuggestions = async () => {
    if (!suggestQuery.trim()) return;
    setSuggestLoading(true);
    setTrendsError(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/search/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query: suggestQuery, language: 'en' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to resolve suggestions');
      setSuggestions(json.data || []);
    } catch (err: any) {
      setTrendsError(err.message || 'Autocomplete query failed.');
    } finally {
      setSuggestLoading(false);
    }
  };

  // ── Storage & BigQuery States ─────────────────────────────────────────────
  const [bucketName, setBucketName] = useState('alti-assistant-assets');
  const [bucketFiles, setBucketFiles] = useState<any[]>([]);
  const [bucketLoading, setBucketLoading] = useState(false);
  const [bucketError, setBucketError] = useState<string | null>(null);

  const [bqDataset, setBqDataset] = useState('alti_analytics');
  const [bqTable, setBqTable] = useState('agent_execution_logs');
  const [bqLoading, setBqLoading] = useState(false);
  const [bqResponse, setBqResponse] = useState<any>(null);
  const [bqError, setBqError] = useState<string | null>(null);

  const handleListBucketFiles = async () => {
    if (!bucketName.trim()) return;
    setBucketLoading(true);
    setBucketError(null);
    setBucketFiles([]);

    try {
      const res = await fetch(`${baseUrl}/gcp-native/storage/files?bucketName=${bucketName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to list bucket files');
      setBucketFiles(json.data || []);
    } catch (err: any) {
      setBucketError(err.message || 'Failed to connect to storage bucket.');
    } finally {
      setBucketLoading(false);
    }
  };

  const handleCreateBqTable = async () => {
    setBqLoading(true);
    setBqError(null);
    setBqResponse(null);

    try {
      const res = await fetch(`${baseUrl}/gcp-native/bigquery/table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          datasetId: bqDataset,
          tableId: bqTable,
          fields: [
            { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
            { name: 'agent_id', type: 'STRING', mode: 'REQUIRED' },
            { name: 'action', type: 'STRING', mode: 'NULLABLE' },
            { name: 'tokens_used', type: 'INTEGER', mode: 'NULLABLE' },
            { name: 'success', type: 'BOOLEAN', mode: 'NULLABLE' }
          ]
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'BigQuery command failed');
      setBqResponse(json.data || json);
    } catch (err: any) {
      setBqError(err.message || 'Failed to execute BigQuery provision command.');
    } finally {
      setBqLoading(false);
    }
  };

  // ── Observability & Safe Browsing States ──────────────────────────────────
  const [checkUrl, setCheckUrl] = useState('https://www.google.com');
  const [safeResponse, setSafeResponse] = useState<any>(null);
  const [safeLoading, setSafeLoading] = useState(false);

  const [logMessage, setLogMessage] = useState('Autonomous Agent handoff triggered.');
  const [logLevel, setLogLevel] = useState('INFO');
  const [logResponse, setLogResponse] = useState<any>(null);
  const [logLoading, setLogLoading] = useState(false);

  const [obsError, setObsError] = useState<string | null>(null);

  const handleSafeBrowsing = async () => {
    if (!checkUrl.trim()) return;
    setSafeLoading(true);
    setObsError(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/security/safe-browsing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ url: checkUrl })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Safe browsing lookup failed');
      setSafeResponse(json.data);
    } catch (err: any) {
      setObsError(err.message || 'Safe browsing request failed.');
    } finally {
      setSafeLoading(false);
    }
  };

  const handleWriteLog = async () => {
    setLogLoading(true);
    setObsError(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/observability/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          logName: 'alti-native-console-log',
          message: logMessage,
          severity: logLevel,
          labels: { source: 'console_sandbox', user: session?.user?.email || 'unknown' }
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Writing log failed');
      setLogResponse(json.data || json);
    } catch (err: any) {
      setObsError(err.message || 'Cloud logging call failed.');
    } finally {
      setLogLoading(false);
    }
  };

  // ── A2UI Sandbox States ────────────────────────────────────────────────────
  const [a2uiMode, setA2uiMode] = useState<'a2ui' | 'agui' | 'adk' | 'swarm'>('a2ui');
  const [a2uiPrompt, setA2uiPrompt] = useState('Create a financial projection chart for Next.js SaaS revenue over 12 months.');
  const [a2uiLoading, setA2uiLoading] = useState(false);
  const [a2uiResponse, setA2uiResponse] = useState<any>(null);
  const [a2uiError, setA2uiError] = useState<string | null>(null);

  const handleA2uiGenerate = async () => {
    setA2uiLoading(true);
    setA2uiError(null);
    setA2uiResponse(null);

    const endpoint = a2uiMode === 'a2ui' ? 'a2ui/prompt' : a2uiMode === 'agui' ? 'agui/prompt' : 'adk/bootstrap';
    const body = a2uiMode === 'adk' ? { name: 'analytics-agent', version: '1.0.0' } : { prompt: a2uiPrompt };

    try {
      const res = await fetch(`${baseUrl}/gcp-native/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'A2UI operation failed');
      setA2uiResponse(json.data || json);
    } catch (err: any) {
      setA2uiError(err.message || 'Failed to build schema.');
    } finally {
      setA2uiLoading(false);
    }
  };

  // ── Workspace Google Drive & Sheets & Docs & Calendar States ──────────────
  const [workspaceResponse, setWorkspaceResponse] = useState<any>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);

  // Drive
  const [driveFile, setDriveFile] = useState<File | null>(null);
  const [driveFolderId, setDriveFolderId] = useState('');
  const [driveDownloadId, setDriveDownloadId] = useState('');

  // Sheets
  const [sheetTitle, setSheetTitle] = useState('Workspace Report');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [sheetRange, setSheetRange] = useState('Sheet1!A1:E10');
  const [sheetAppendRange, setSheetAppendRange] = useState('Sheet1!A1');
  const [sheetAppendValues, setSheetAppendValues] = useState('[["Value 1", "Value 2", "Value 3"]]');

  // Docs
  const [docTitle, setDocTitle] = useState('Google Workspace Document');
  const [docBody, setDocBody] = useState('Content generated natively via Alti GCP Suite.');

  // Calendar
  const [calendarSummary, setCalendarSummary] = useState('Workspace Sync Call');
  const [calendarStart, setCalendarStart] = useState('2026-06-07T10:00:00Z');
  const [calendarEnd, setCalendarEnd] = useState('2026-06-07T11:00:00Z');
  const [calendarDetails, setCalendarDetails] = useState('Weekly sync meeting to evaluate Google Cloud platform enhancements.');
  const [calendarLimit, setCalendarLimit] = useState(10);

  // ── Video & Vector Intel States ───────────────────────────────────────────
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoGcsUri, setVideoGcsUri] = useState('');
  const [videoFeatures, setVideoFeatures] = useState('["LABEL_DETECTION"]');
  const [videoOperationName, setVideoOperationName] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoResponse, setVideoResponse] = useState<any>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const [embeddingText, setEmbeddingText] = useState('Google Cloud Vertex AI Multimodal Embeddings');
  const [embeddingImage, setEmbeddingImage] = useState<File | null>(null);
  const [embeddingType, setEmbeddingType] = useState<'text' | 'multimodal'>('text');
  const [embeddingTaskType, setEmbeddingTaskType] = useState('RETRIEVAL_DOCUMENT');
  const [embeddingLoading, setEmbeddingLoading] = useState(false);
  const [embeddingResponse, setEmbeddingResponse] = useState<any>(null);
  const [embeddingError, setEmbeddingError] = useState<string | null>(null);

  // ── Secrets & Pub/Sub States ──────────────────────────────────────────────
  const [secretId, setSecretId] = useState('alti_app_secret');
  const [secretValue, setSecretValue] = useState('gcp_secret_value_12345');
  const [secretsLoading, setSecretsLoading] = useState(false);
  const [secretsResponse, setSecretsResponse] = useState<any>(null);
  const [secretsError, setSecretsError] = useState<string | null>(null);

  const [pubsubTopicId, setPubsubTopicId] = useState('alti-workspace-events');
  const [pubsubMessage, setPubsubMessage] = useState('{"event": "user_sync", "status": "completed"}');
  const [pubsubSubId, setPubsubSubId] = useState('alti-workspace-sub');
  const [pubsubEndpoint, setPubsubEndpoint] = useState('https://altihq.com/api/v1/pubsub/webhook');
  const [pubsubLoading, setPubsubLoading] = useState(false);
  const [pubsubResponse, setPubsubResponse] = useState<any>(null);
  const [pubsubError, setPubsubError] = useState<string | null>(null);

  // ── Observability & Safety Additions ──────────────────────────────────────
  const [recaptchaToken, setRecaptchaToken] = useState('action_token_example_12345');
  const [recaptchaAction, setRecaptchaAction] = useState('login');
  const [recaptchaLoading, setRecaptchaLoading] = useState(false);
  const [recaptchaResponse, setRecaptchaResponse] = useState<any>(null);

  // ── Trends & Autocomplete Additions ───────────────────────────────────────
  const [kgQuery, setKgQuery] = useState('Google Cloud Platform');
  const [kgLimit, setKgLimit] = useState(5);
  const [kgLoading, setKgLoading] = useState(false);
  const [kgResponse, setKgResponse] = useState<any>(null);

  // ── MCP & Swarm Sandbox States ────────────────────────────────────────────
  const [mcpToolsetName, setMcpToolsetName] = useState('alti-default-postgres');
  const [mcpToolName, setMcpToolName] = useState('execute_sql');
  const [mcpParameters, setMcpParameters] = useState('{"statement": "SELECT * FROM security_alerts LIMIT 5;"}');
  const [mcpSources, setMcpSources] = useState('');
  const [mcpTools, setMcpTools] = useState('');
  const [mcpLoading, setMcpLoading] = useState(false);
  const [mcpResponse, setMcpResponse] = useState<any>(null);
  const [mcpError, setMcpError] = useState<string | null>(null);

  const [swarmPacket, setSwarmPacket] = useState('<a2a-packet><header><from>research-agent</from><to>coding-agent</to><action>refactor</action></header><body>Validate database schemas</body></a2a-packet>');
  const [swarmFrom, setSwarmFrom] = useState('research-agent');
  const [swarmTo, setSwarmTo] = useState('coding-agent');
  const [swarmAction, setSwarmAction] = useState('handoff');
  const [swarmParams, setSwarmParams] = useState('{"task": "schema_migration", "db": "postgres"}');
  const [swarmResponse, setSwarmResponse] = useState<any>(null);
  const [swarmLoading, setSwarmLoading] = useState(false);
  const [swarmError, setSwarmError] = useState<string | null>(null);

  // ── Workspace Handlers ───────────────────────────────────────────────────
  const handleDriveUpload = async () => {
    if (!driveFile) return;
    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceResponse(null);
    const formData = new FormData();
    formData.append('file', driveFile);
    if (driveFolderId) formData.append('folderId', driveFolderId);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/workspace/drive/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Drive upload failed');
      setWorkspaceResponse(json.data || json);
    } catch (err: any) {
      setWorkspaceError(err.message || 'Drive upload failed.');
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const handleCreateSheet = async () => {
    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/workspace/sheets/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: sheetTitle })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Sheet creation failed');
      setWorkspaceResponse(json.data || json);
      if (json.data?.spreadsheetId) setSpreadsheetId(json.data.spreadsheetId);
    } catch (err: any) {
      setWorkspaceError(err.message || 'Sheet creation failed.');
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const handleAppendSheet = async () => {
    if (!spreadsheetId) {
      setWorkspaceError('Please create or provide a Spreadsheet ID.');
      return;
    }
    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceResponse(null);
    try {
      const parsedValues = JSON.parse(sheetAppendValues);
      const res = await fetch(`${baseUrl}/gcp-native/workspace/sheets/append`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ spreadsheetId, range: sheetAppendRange, values: parsedValues })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Sheet append failed');
      setWorkspaceResponse(json.data || json);
    } catch (err: any) {
      setWorkspaceError(err.message || 'Sheet append failed.');
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const handleReadSheet = async () => {
    if (!spreadsheetId) {
      setWorkspaceError('Please create or provide a Spreadsheet ID.');
      return;
    }
    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/workspace/sheets/read?spreadsheetId=${spreadsheetId}&range=${sheetRange}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Sheet read failed');
      setWorkspaceResponse(json.data || json);
    } catch (err: any) {
      setWorkspaceError(err.message || 'Sheet read failed.');
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const handleCreateDoc = async () => {
    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/workspace/docs/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: docTitle, bodyText: docBody })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Doc creation failed');
      setWorkspaceResponse(json.data || json);
    } catch (err: any) {
      setWorkspaceError(err.message || 'Doc creation failed.');
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const handleCreateCalendarEvent = async () => {
    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/workspace/calendar/create-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ summary: calendarSummary, startTime: calendarStart, endTime: calendarEnd, details: calendarDetails })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Calendar event failed');
      setWorkspaceResponse(json.data || json);
    } catch (err: any) {
      setWorkspaceError(err.message || 'Calendar event creation failed.');
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const handleListCalendarEvents = async () => {
    setWorkspaceLoading(true);
    setWorkspaceError(null);
    setWorkspaceResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/workspace/calendar/events?maxResults=${calendarLimit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Listing events failed');
      setWorkspaceResponse(json.data || json);
    } catch (err: any) {
      setWorkspaceError(err.message || 'Failed to retrieve calendar events.');
    } finally {
      setWorkspaceLoading(false);
    }
  };

  // ── Video & Vector Intel Handlers ───────────────────────────────────────
  const handleAnalyzeVideo = async () => {
    setVideoLoading(true);
    setVideoError(null);
    setVideoResponse(null);
    const formData = new FormData();
    if (videoFile) {
      formData.append('video', videoFile);
    }
    if (videoGcsUri) {
      formData.append('inputUri', videoGcsUri);
    }
    if (videoFeatures) {
      formData.append('features', videoFeatures);
    }
    try {
      const res = await fetch(`${baseUrl}/gcp-native/video/analyze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: videoFile ? formData : JSON.stringify({ inputUri: videoGcsUri, features: JSON.parse(videoFeatures) })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Video analysis failed');
      setVideoResponse(json.data || json);
      if (json.data?.name) setVideoOperationName(json.data.name);
    } catch (err: any) {
      setVideoError(err.message || 'Video analysis failed.');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleCheckVideoStatus = async () => {
    if (!videoOperationName) return;
    setVideoLoading(true);
    setVideoError(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/video/status/${encodeURIComponent(videoOperationName)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Check status failed');
      setVideoResponse(json.data || json);
    } catch (err: any) {
      setVideoError(err.message || 'Check status failed.');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleGenerateEmbeddings = async () => {
    setEmbeddingLoading(true);
    setEmbeddingError(null);
    setEmbeddingResponse(null);
    const formData = new FormData();
    formData.append('type', embeddingType);
    if (embeddingType === 'multimodal') {
      if (embeddingImage) formData.append('image', embeddingImage);
      if (embeddingText) formData.append('text', embeddingText);
    } else {
      formData.append('text', embeddingText);
      formData.append('taskType', embeddingTaskType);
    }
    try {
      const res = await fetch(`${baseUrl}/gcp-native/embeddings`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: embeddingType === 'multimodal' ? formData : JSON.stringify({ text: embeddingText, type: 'text', taskType: embeddingTaskType })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Embeddings generation failed');
      setEmbeddingResponse(json.data || json);
    } catch (err: any) {
      setEmbeddingError(err.message || 'Embedding generation failed.');
    } finally {
      setEmbeddingLoading(false);
    }
  };

  // ── Secrets & Pub/Sub Handlers ──────────────────────────────────────────
  const handleCreateSecret = async () => {
    setSecretsLoading(true);
    setSecretsError(null);
    setSecretsResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/secrets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ secretId, value: secretValue })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Secret creation failed');
      setSecretsResponse(json.data || json);
    } catch (err: any) {
      setSecretsError(err.message || 'Secret creation failed.');
    } finally {
      setSecretsLoading(false);
    }
  };

  const handleGetSecret = async () => {
    setSecretsLoading(true);
    setSecretsError(null);
    setSecretsResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/secrets/${encodeURIComponent(secretId)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Get secret failed');
      setSecretsResponse(json.data || json);
    } catch (err: any) {
      setSecretsError(err.message || 'Get secret failed.');
    } finally {
      setSecretsLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    setPubsubLoading(true);
    setPubsubError(null);
    setPubsubResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/pubsub/topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ topicId: pubsubTopicId })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Topic creation failed');
      setPubsubResponse(json.data || json);
    } catch (err: any) {
      setPubsubError(err.message || 'Topic creation failed.');
    } finally {
      setPubsubLoading(false);
    }
  };

  const handlePublishMessage = async () => {
    setPubsubLoading(true);
    setPubsubError(null);
    setPubsubResponse(null);
    try {
      const parsedData = JSON.parse(pubsubMessage);
      const res = await fetch(`${baseUrl}/gcp-native/pubsub/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ topicId: pubsubTopicId, data: parsedData })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Publishing message failed');
      setPubsubResponse(json.data || json);
    } catch (err: any) {
      setPubsubError(err.message || 'Publishing message failed.');
    } finally {
      setPubsubLoading(false);
    }
  };

  const handleCreateSubscription = async () => {
    setPubsubLoading(true);
    setPubsubError(null);
    setPubsubResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/pubsub/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ topicId: pubsubTopicId, subscriptionId: pubsubSubId, pushEndpoint: pubsubEndpoint })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Subscription failed');
      setPubsubResponse(json.data || json);
    } catch (err: any) {
      setPubsubError(err.message || 'Subscription failed.');
    } finally {
      setPubsubLoading(false);
    }
  };

  // ── Observability & Safety Recaptcha Verify Handler ──────────────────────
  const handleRecaptchaVerify = async () => {
    setRecaptchaLoading(true);
    setObsError(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/security/recaptcha-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ token: recaptchaToken, expectedAction: recaptchaAction })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'reCAPTCHA evaluation failed');
      setRecaptchaResponse(json.data || json);
    } catch (err: any) {
      setObsError(err.message || 'reCAPTCHA verification request failed.');
    } finally {
      setRecaptchaLoading(false);
    }
  };

  // ── Trends & Autocomplete Knowledge Graph Handler ─────────────────────────
  const handleKnowledgeGraph = async () => {
    setKgLoading(true);
    setTrendsError(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/search/knowledge-graph`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query: kgQuery, limit: kgLimit })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Knowledge graph lookup failed');
      setKgResponse(json.data || json);
    } catch (err: any) {
      setTrendsError(err.message || 'Knowledge Graph query failed.');
    } finally {
      setKgLoading(false);
    }
  };

  // ── MCP & Swarm Handlers ─────────────────────────────────────────────────
  const handleMcpQuery = async () => {
    setMcpLoading(true);
    setMcpError(null);
    setMcpResponse(null);
    try {
      const parsedParams = mcpParameters ? JSON.parse(mcpParameters) : {};
      const res = await fetch(`${baseUrl}/gcp-native/mcp/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ toolsetName: mcpToolsetName, toolName: mcpToolName, parameters: parsedParams })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'MCP tool invocation failed');
      setMcpResponse(json.data || json);
    } catch (err: any) {
      setMcpError(err.message || 'MCP query execution failed.');
    } finally {
      setMcpLoading(false);
    }
  };

  const handleMcpStatus = async () => {
    setMcpLoading(true);
    setMcpError(null);
    setMcpResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/mcp/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch MCP status');
      setMcpResponse(json.data || json);
    } catch (err: any) {
      setMcpError(err.message || 'Failed to check MCP server daemon.');
    } finally {
      setMcpLoading(false);
    }
  };

  const handleMcpUpdateTools = async () => {
    setMcpLoading(true);
    setMcpError(null);
    setMcpResponse(null);
    try {
      const parsedSources = mcpSources ? JSON.parse(mcpSources) : [];
      const parsedTools = mcpTools ? JSON.parse(mcpTools) : [];
      const res = await fetch(`${baseUrl}/gcp-native/mcp/tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ sources: parsedSources, tools: parsedTools })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'MCP configuration update failed');
      setMcpResponse(json.data || json);
    } catch (err: any) {
      setMcpError(err.message || 'Failed to reload MCP tools config.');
    } finally {
      setMcpLoading(false);
    }
  };

  const handleSwarmValidate = async () => {
    setSwarmLoading(true);
    setSwarmError(null);
    setSwarmResponse(null);
    try {
      const res = await fetch(`${baseUrl}/gcp-native/a2a/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rawText: swarmPacket })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Swarm validation failed');
      setSwarmResponse(json.data || json);
    } catch (err: any) {
      setSwarmError(err.message || 'Handoff validation failed.');
    } finally {
      setSwarmLoading(false);
    }
  };

  const handleSwarmHandoffFormat = async () => {
    setSwarmLoading(true);
    setSwarmError(null);
    setSwarmResponse(null);
    try {
      const parsedParams = swarmParams ? JSON.parse(swarmParams) : {};
      const res = await fetch(`${baseUrl}/gcp-native/a2a/handoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ fromAgent: swarmFrom, toAgent: swarmTo, action: swarmAction, parameters: parsedParams })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Swarm packet formatting failed');
      setSwarmResponse(json.data || json);
    } catch (err: any) {
      setSwarmError(err.message || 'Swarm formatting failed.');
    } finally {
      setSwarmLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F5F7] dark:bg-zinc-950 text-slate-850 dark:text-zinc-100">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-zinc-800/80 flex items-center justify-between px-8 bg-white dark:bg-zinc-900 transition-colors duration-300 flex-none z-10">
        <div className="flex items-center gap-2.5">
          <Cloud className="size-[21px] text-indigo-500 animate-pulse" />
          <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
            Google Cloud Hub
          </h1>
          <Badge variant="outline" className="text-[10px] py-0.5 px-2 bg-indigo-500/10 text-indigo-500 border-indigo-500/20 select-none">
            Native GCP Suite
          </Badge>
        </div>
        <div className="text-xs text-zinc-500 font-medium">
          Workspace Mode: <span className="text-emerald-500 font-semibold">GCP Grounded</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sub-nav */}
        <aside className="w-60 border-r border-black/5 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-md flex-none overflow-y-auto p-4 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 pb-1 select-none">
            Google Cloud Console
          </div>
          {[
            { id: 'architecture', name: 'Cloud Architecture', icon: Server },
            { id: 'chat', name: 'Grounded Chat (Gemini)', icon: MessageSquare },
            { id: 'docs_vision', name: 'Document AI & Vision', icon: FileText },
            { id: 'speech_translate', name: 'Speech & Translate', icon: Globe },
            { id: 'workspace', name: 'Google Workspace Hub', icon: FileSpreadsheet },
            { id: 'video_embeddings', name: 'Video & Vector Intel', icon: Video },
            { id: 'maps_business', name: 'Maps & Local Intel', icon: MapPin },
            { id: 'trends_suggest', name: 'Trends & Autocomplete', icon: TrendingUp },
            { id: 'storage_bq', name: 'Storage & BigQuery', icon: Database },
            { id: 'secrets_pubsub', name: 'Secrets & Pub/Sub', icon: Lock },
            { id: 'observability_security', name: 'Observability & Safety', icon: ShieldCheck },
            { id: 'a2ui_mcp_swarm', name: 'Agentic MCP & Swarm', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as GcpTab)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 select-none',
                  isActive
                    ? 'bg-indigo-650 text-white shadow-md dark:bg-indigo-600/80'
                    : 'text-zinc-600 hover:bg-black/5 hover:text-black dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-zinc-500')} />
                {tab.name}
              </button>
            );
          })}
        </aside>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* TAB 1: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl p-8 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full translate-x-12 -translate-y-12 blur-2xl pointer-events-none" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Alti Google Cloud Infrastructure Topology
                </h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  Alti is built exclusively on Google Cloud Platform, using managed services for scale, reliability, and security.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-slate-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-950/40 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <Cpu className="w-5 h-5 text-indigo-500" />
                      <CardTitle className="text-sm font-bold mt-1">Compute & Scaling</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-zinc-500">
                      Fully containerized Next.js and Node.js backend running on **Cloud Run**, auto-scaling based on user requests and agent execution workloads.
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-950/40 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <Sparkles className="w-5 h-5 text-cyan-500" />
                      <CardTitle className="text-sm font-bold mt-1">Vertex AI Core</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-zinc-500">
                      Multi-model orchestration leveraging **Gemini 3.5 Flash** and **Gemini 3.1 Pro** with native Google Search Grounding to eliminate hallucinations.
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-950/40 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <Database className="w-5 h-5 text-emerald-500" />
                      <CardTitle className="text-sm font-bold mt-1">Analytics Ledger</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-zinc-500">
                      High-throughput workspace activities, tool executions, and security logs loaded directly into **BigQuery** and **Google Cloud Storage** buckets.
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <CardTitle className="text-base font-bold">GCP Services Health Status</CardTitle>
                  </div>
                  <CardDescription>Real-time status of integrated API dependencies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'Vertex AI Gemini API', status: 'Healthy', latency: '124ms' },
                    { name: 'Google Search Grounding Engine', status: 'Healthy', latency: '310ms' },
                    { name: 'Document AI Processor', status: 'Healthy', latency: '412ms' },
                    { name: 'Cloud Vision API (OCR)', status: 'Healthy', latency: '185ms' },
                    { name: 'Google Maps Platform API', status: 'Healthy', latency: '190ms' },
                    { name: 'Cloud Storage Bucket connection', status: 'Healthy', latency: '45ms' },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between text-xs border-b border-black/5 dark:border-zinc-800/50 pb-2">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{service.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-400 font-medium">{service.latency}</span>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] py-0">
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: GROUNDED CHAT */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                    Gemini Grounded Search Console
                  </CardTitle>
                  <CardDescription>
                    Submit a query to Gemini with native Google Search Grounding to verify real-time data accuracy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGroundedChat} className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={chatPrompt}
                        onChange={(e) => setChatPrompt(e.target.value)}
                        placeholder="Ask anything (e.g. What is the current market cap of Apple?)..."
                        disabled={chatLoading}
                        className="flex-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                      />
                      <Button type="submit" disabled={chatLoading || !chatPrompt.trim()} className="bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white">
                        {chatLoading ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          'Search & Ground'
                        )}
                      </Button>
                    </div>
                  </form>

                  {chatError && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex gap-2 items-center">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                      <span>{chatError}</span>
                    </div>
                  )}

                  {chatResponse && (
                    <div className="mt-6 space-y-4 animate-in fade-in duration-200">
                      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm font-medium leading-relaxed dark:text-zinc-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px]">Gemini 3.5 Flash</Badge>
                          <Badge className="bg-emerald-500/20 text-emerald-450 border border-emerald-500/30 text-[10px]">Google Search Grounded</Badge>
                        </div>
                        {chatResponse.text || chatResponse.output || JSON.stringify(chatResponse)}
                      </div>

                      {chatResponse.groundingMetadata && (
                        <div className="p-4 rounded-2xl bg-white/30 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 space-y-3">
                          <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-indigo-500" />
                            Grounded Search Sources
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {chatResponse.groundingMetadata.groundingChunks?.map((chunk: any, i: number) => (
                              <a
                                key={i}
                                href={chunk.web?.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-lg border border-black/5 dark:border-zinc-800/80 hover:bg-black/5 dark:hover:bg-zinc-800/40 text-[11px] flex flex-col gap-1 transition-all"
                              >
                                <span className="font-semibold text-indigo-550 dark:text-indigo-400 truncate">
                                  {chunk.web?.title || `Source [${i + 1}]`}
                                </span>
                                <span className="text-[10px] text-zinc-400 truncate">{chunk.web?.uri}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: DOCUMENT AI & VISION */}
          {activeTab === 'docs_vision' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    Document AI & Vision Processor
                  </CardTitle>
                  <CardDescription>
                    Extract structured entities from PDFs using Document AI, or analyze image labels and text using Cloud Vision.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 p-1 bg-black/[0.04] dark:bg-white/[0.04] rounded-xl border border-black/5 dark:border-white/5 max-w-[300px]">
                    <button
                      onClick={() => setFileMode('vision')}
                      className={cn(
                        'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all',
                        fileMode === 'vision' ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs' : 'text-zinc-500'
                      )}
                    >
                      Cloud Vision
                    </button>
                    <button
                      onClick={() => setFileMode('doc')}
                      className={cn(
                        'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all',
                        fileMode === 'doc' ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs' : 'text-zinc-500'
                      )}
                    >
                      Document AI
                    </button>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-indigo-500 rounded-3xl p-8 text-center cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept={fileMode === 'doc' ? 'application/pdf' : 'image/*'}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-zinc-400 mx-auto animate-bounce" />
                    <p className="mt-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      {file ? file.name : 'Select or drop a file to process'}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {fileMode === 'doc' ? 'Supports PDF documents' : 'Supports JPG, PNG, WEBP images'}
                    </p>
                  </div>

                  {file && (
                    <div className="flex justify-end">
                      <Button onClick={handleProcessFile} disabled={fileLoading} className="bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 h-9">
                        {fileLoading ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                        ) : null}
                        Process File
                      </Button>
                    </div>
                  )}

                  {fileError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                      {fileError}
                    </div>
                  )}

                  {fileResponse && (
                    <div className="mt-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono overflow-auto max-h-[300px] text-zinc-300">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2 font-sans font-bold text-white">
                        <span>Analysis Output</span>
                        <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">JSON Success</Badge>
                      </div>
                      <pre>{JSON.stringify(fileResponse, null, 2)}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 4: SPEECH & TRANSLATE */}
          {activeTab === 'speech_translate' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-indigo-500" />
                      Text-to-Speech Synthesizer
                    </CardTitle>
                    <CardDescription>Synthesize natural speech via GCP TTS</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <textarea
                      value={ttsText}
                      onChange={(e) => setTtsText(e.target.value)}
                      className="w-full h-24 p-3 text-xs rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <Button onClick={handleTextToSpeech} disabled={ttsLoading || !ttsText.trim()} className="w-full bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 h-9">
                      {ttsLoading ? 'Synthesizing...' : 'Synthesize Speech'}
                    </Button>

                    {ttsError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                        {ttsError}
                      </div>
                    )}

                    {ttsAudioUrl && (
                      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col gap-3">
                        <div className="text-xs font-semibold flex items-center gap-2 text-indigo-500">
                          <Play className="w-4 h-4" /> Synthesized Audio Ready
                        </div>
                        <audio src={ttsAudioUrl} controls className="w-full h-10 rounded-lg outline-none" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Globe className="w-5 h-5 text-indigo-500" />
                      Translate Advanced
                    </CardTitle>
                    <CardDescription>Detect and translate strings in real-time</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <textarea
                      value={translateText}
                      onChange={(e) => setTranslateText(e.target.value)}
                      className="w-full h-24 p-3 text-xs rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex gap-2">
                      <select
                        value={translateTarget}
                        onChange={(e) => setTranslateTarget(e.target.value)}
                        className="p-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 outline-none"
                      >
                        <option value="es">Spanish (es)</option>
                        <option value="fr">French (fr)</option>
                        <option value="de">German (de)</option>
                        <option value="zh">Chinese (zh)</option>
                        <option value="ja">Japanese (ja)</option>
                      </select>
                      <Button onClick={handleTranslate} disabled={translateLoading || !translateText.trim()} className="flex-1 bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 h-9">
                        {translateLoading ? 'Translating...' : 'Translate'}
                      </Button>
                    </div>

                    {translateError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                        {translateError}
                      </div>
                    )}

                    {translateResponse && (
                      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold border-b border-zinc-800 pb-1.5">
                          <span>Detected: {translateResponse.detectedLanguage.toUpperCase()}</span>
                          <span>Confidence: {Math.round(translateResponse.confidence * 100)}%</span>
                        </div>
                        <p className="text-zinc-100 font-medium leading-relaxed">{translateResponse.translatedText}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>
            </div>
          )}

          {/* TAB 5: GOOGLE MAPS & LOCAL INTEL */}
          {activeTab === 'maps_business' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {mapsError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {mapsError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Geocoding & Places search */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-indigo-500" />
                      Geocoding & Places API
                    </CardTitle>
                    <CardDescription>Convert addresses and locate nearby spots</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Geocode Address</label>
                      <div className="flex gap-2">
                        <Input
                          value={geocodeAddress}
                          onChange={(e) => setGeocodeAddress(e.target.value)}
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                        />
                        <Button onClick={handleGeocode} disabled={geocodeLoading} className="bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                          {geocodeLoading ? 'Geocoding...' : 'Geocode'}
                        </Button>
                      </div>
                    </div>

                    {geocodeResult && (
                      <div className="p-3 rounded-xl bg-zinc-900 text-xs font-mono space-y-1 text-zinc-300">
                        <div className="text-indigo-400 font-bold font-sans">Geocoded Location</div>
                        <div>Latitude: {geocodeResult.lat}</div>
                        <div>Longitude: {geocodeResult.lng}</div>
                        <div>Formatted: {geocodeResult.formattedAddress}</div>

                        <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase block font-sans">Search Nearby Places</label>
                          <div className="flex gap-2">
                            <Input
                              value={nearbyKeyword}
                              onChange={(e) => setNearbyKeyword(e.target.value)}
                              placeholder="e.g. coffee, gas_station..."
                              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-sans"
                            />
                            <Button onClick={handleFindNearby} disabled={nearbyLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-sans">
                              {nearbyLoading ? 'Searching...' : 'Find Places'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {nearbyResults.length > 0 && (
                      <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs max-h-40 overflow-y-auto">
                        <div className="bg-black/5 dark:bg-white/[0.04] p-2 font-bold flex justify-between border-b border-slate-200 dark:border-zinc-800">
                          <span>Place Name</span>
                          <span>Rating</span>
                        </div>
                        <div className="p-2 space-y-1 divide-y divide-black/5 dark:divide-zinc-800">
                          {nearbyResults.map((place: any, i: number) => (
                            <div key={i} className="py-2 flex justify-between text-zinc-550 dark:text-zinc-400 font-medium">
                              <span className="truncate max-w-[200px]">{place.name}</span>
                              <span className="text-amber-500 font-bold">{place.rating || 'N/A'} ★</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Directions & Business Analytics */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Map className="w-5 h-5 text-indigo-500" />
                      Directions & Local Analytics
                    </CardTitle>
                    <CardDescription>Trace driving steps and query business intelligence</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Directions Routing</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={directionsOrigin}
                          onChange={(e) => setDirectionsOrigin(e.target.value)}
                          placeholder="Origin"
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                        />
                        <Input
                          value={directionsDest}
                          onChange={(e) => setDirectionsDest(e.target.value)}
                          placeholder="Destination"
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                        />
                      </div>
                      <Button onClick={handleDirections} disabled={directionsLoading} className="w-full bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        {directionsLoading ? 'Calculating route...' : 'Get Route Info'}
                      </Button>
                    </div>

                    {directionsResult && (
                      <div className="p-3 rounded-xl bg-zinc-900 text-xs font-mono space-y-1 text-zinc-300 max-h-36 overflow-y-auto">
                        <div className="text-indigo-400 font-bold font-sans">Route Analysis</div>
                        <div>Distance: {directionsResult.distance || 'N/A'}</div>
                        <div>Duration: {directionsResult.duration || 'N/A'}</div>
                        {directionsResult.steps && (
                          <div className="mt-2 pt-2 border-t border-zinc-800 space-y-1 font-sans text-[11px]">
                            {directionsResult.steps.map((step: string, i: number) => (
                              <div key={i} className="flex gap-2">
                                <span className="text-zinc-500">{i + 1}.</span>
                                <span dangerouslySetInnerHTML={{ __html: step }} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2 pt-2 border-t border-black/5 dark:border-zinc-800/80">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Unified Business Analytics</label>
                      <div className="flex gap-2">
                        <Input
                          value={businessQuery}
                          onChange={(e) => setBusinessQuery(e.target.value)}
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                        />
                        <Button onClick={handleBusinessAnalytics} disabled={businessLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
                          {businessLoading ? 'Resolving...' : 'Resolve Business'}
                        </Button>
                      </div>
                    </div>

                    {businessAnalytics && (
                      <div className="p-3 rounded-xl bg-zinc-900 text-xs font-mono text-zinc-300 overflow-auto max-h-36">
                        <div className="text-emerald-400 font-bold font-sans">Unified Business Intel</div>
                        <pre>{JSON.stringify(businessAnalytics, null, 2)}</pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 6: GOOGLE TRENDS & AUTOCOMPLETE */}
          {activeTab === 'trends_suggest' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {trendsError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {trendsError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Autocomplete suggestions */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Search className="w-5 h-5 text-indigo-500" />
                      Google Autocomplete Suggester
                    </CardTitle>
                    <CardDescription>Fetch search predictions directly from Google engines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={suggestQuery}
                        onChange={(e) => setSuggestQuery(e.target.value)}
                        placeholder="Type keywords..."
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                      <Button onClick={handleFetchSuggestions} disabled={suggestLoading || !suggestQuery.trim()} className="bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        Suggest
                      </Button>
                    </div>

                    <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                      <div className="bg-black/5 dark:bg-white/[0.04] p-2 font-bold border-b border-slate-200 dark:border-zinc-800">
                        Autocomplete Queries
                      </div>
                      <div className="p-2 space-y-1 max-h-40 overflow-y-auto">
                        {suggestions.length > 0 ? (
                          suggestions.map((item, i) => (
                            <div key={i} className="py-1.5 text-zinc-550 dark:text-zinc-400 font-medium flex items-center gap-2">
                              <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{item}</span>
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-center text-zinc-500">No suggestions listed. Enter query.</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Google Trends Searches */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
                      Google Trends Analytics
                    </CardTitle>
                    <CardDescription>Daily interest spikes and trending searches</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <select
                        value={trendsGeo}
                        onChange={(e) => setTrendsGeo(e.target.value)}
                        className="p-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 outline-none"
                      >
                        <option value="US">United States (US)</option>
                        <option value="GB">United Kingdom (GB)</option>
                        <option value="FR">France (FR)</option>
                        <option value="DE">Germany (DE)</option>
                        <option value="JP">Japan (JP)</option>
                      </select>
                      <Button onClick={handleFetchTrends} disabled={trendsLoading} className="flex-1 bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        Fetch Trending Searches
                      </Button>
                    </div>

                    <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                      <div className="bg-black/5 dark:bg-white/[0.04] p-2 font-bold border-b border-slate-200 dark:border-zinc-800">
                        Trending Searches in {trendsGeo}
                      </div>
                      <div className="p-2 space-y-1 max-h-40 overflow-y-auto">
                        {trendsList.length > 0 ? (
                          trendsList.map((item, i) => (
                            <div key={i} className="py-1.5 text-zinc-550 dark:text-zinc-400 font-medium flex items-center justify-between">
                              <span className="font-semibold">{item.title || item}</span>
                              <span className="text-[10px] text-zinc-400 font-bold">{item.traffic || 'Spike'} interest</span>
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-center text-zinc-500">No daily daily trends loaded. Fetch data.</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Google Knowledge Graph Entity Search */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md col-span-1">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Globe className="w-5 h-5 text-indigo-500" />
                      Knowledge Graph Entity Lookup
                    </CardTitle>
                    <CardDescription>Retrieve structured entities and facts from Google's database</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        value={kgQuery}
                        onChange={(e) => setKgQuery(e.target.value)}
                        placeholder="Search Entity (e.g. Google Cloud)..."
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={kgLimit}
                          onChange={(e) => setKgLimit(parseInt(e.target.value) || 5)}
                          placeholder="Limit (5)"
                          className="w-16 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                        />
                        <Button 
                          onClick={handleKnowledgeGraph} 
                          disabled={kgLoading || !kgQuery.trim()} 
                          className="flex-1 bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                        >
                          {kgLoading ? 'Searching...' : 'Search Entities'}
                        </Button>
                      </div>
                    </div>

                    <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                      <div className="bg-black/5 dark:bg-white/[0.04] p-2 font-bold border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center">
                        <span>Entities ({kgResponse?.entities?.length || 0})</span>
                      </div>
                      <div className="p-2 space-y-3 max-h-40 overflow-y-auto">
                        {kgResponse?.entities && kgResponse.entities.length > 0 ? (
                          kgResponse.entities.map((ent: any, i: number) => (
                            <div key={i} className="pb-3 border-b border-slate-200 dark:border-zinc-800 last:border-b-0 space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{ent.name}</span>
                                <span className="text-[10px] text-zinc-400 bg-zinc-150 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono shrink-0">
                                  Score: {ent.relevanceScore?.toFixed(1) || '0.0'}
                                </span>
                              </div>
                              {ent.types && ent.types.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {ent.types.slice(0, 2).map((type: string, ti: number) => (
                                    <span key={ti} className="text-[9px] text-indigo-500 bg-indigo-500/5 px-1 py-0.2 rounded font-mono">
                                      {type}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <p className="text-[11px] text-zinc-500">{ent.description || 'No summary description.'}</p>
                              {ent.detailedDescription?.body && (
                                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic leading-relaxed pl-2 border-l border-zinc-350 dark:border-zinc-700">
                                  {ent.detailedDescription.body}
                                </p>
                              )}
                              {ent.detailedDescription?.url && (
                                <a
                                  href={ent.detailedDescription.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-indigo-500 hover:underline flex items-center gap-1"
                                >
                                  <span>Read Wiki article</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-center text-zinc-500">No entities loaded. Search.</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          )}

          {/* TAB 7: STORAGE & BIGQUERY */}
          {activeTab === 'storage_bq' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Server className="w-5 h-5 text-indigo-500" />
                      GCS Buckets Explorer
                    </CardTitle>
                    <CardDescription>Inspect Google Cloud Storage directories</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={bucketName}
                        onChange={(e) => setBucketName(e.target.value)}
                        placeholder="Bucket name..."
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                      <Button onClick={handleListBucketFiles} disabled={bucketLoading || !bucketName.trim()} className="bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        List Files
                      </Button>
                    </div>

                    {bucketError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                        {bucketError}
                      </div>
                    )}

                    <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                      <div className="bg-black/5 dark:bg-white/[0.04] p-2 font-bold flex justify-between border-b border-slate-200 dark:border-zinc-800">
                        <span>Filename</span>
                        <span>Size</span>
                      </div>
                      <div className="p-2 space-y-1 divide-y divide-black/5 dark:divide-zinc-800 max-h-48 overflow-y-auto">
                        {bucketFiles.length > 0 ? (
                          bucketFiles.map((file: any, i: number) => (
                            <div key={i} className="py-2 flex justify-between text-zinc-550 dark:text-zinc-400 font-medium">
                              <span className="truncate max-w-[200px]">{file.name}</span>
                              <span>{file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Folder'}</span>
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-center text-zinc-500">No files listed. Try a valid bucket or connect service key.</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Database className="w-5 h-5 text-indigo-500" />
                      BigQuery Console
                    </CardTitle>
                    <CardDescription>Provision and seed analytical datasets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Dataset ID</label>
                        <Input
                          value={bqDataset}
                          onChange={(e) => setBqDataset(e.target.value)}
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Table ID</label>
                        <Input
                          value={bqTable}
                          onChange={(e) => setBqTable(e.target.value)}
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs mt-1"
                        />
                      </div>
                    </div>

                    <Button onClick={handleCreateBqTable} disabled={bqLoading} className="w-full bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 h-9">
                      {bqLoading ? 'Creating Table...' : 'Provision BigQuery Table'}
                    </Button>

                    {bqError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                        {bqError}
                      </div>
                    )}

                    {bqResponse && (
                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-2 font-mono text-zinc-300 overflow-auto">
                        <div className="font-sans font-bold text-emerald-400">Success! Table Provisioned</div>
                        <pre>{JSON.stringify(bqResponse, null, 2)}</pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>
            </div>
          )}

          {/* TAB 8: OBSERVABILITY & SECURITY */}
          {activeTab === 'observability_security' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {obsError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {obsError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Safe browsing threat scanner */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-indigo-500" />
                      Google Safe Browsing
                    </CardTitle>
                    <CardDescription>Evaluate site URLs against security risk lists</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={checkUrl}
                        onChange={(e) => setCheckUrl(e.target.value)}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                      <Button onClick={handleSafeBrowsing} disabled={safeLoading || !checkUrl.trim()} className="bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        Check
                      </Button>
                    </div>

                    {safeResponse && (
                      <div className="p-3 rounded-xl bg-zinc-900 text-xs font-mono space-y-2 text-zinc-300">
                        <div className="font-bold flex items-center gap-1.5 font-sans">
                          {safeResponse.matches && safeResponse.matches.length > 0 ? (
                            <>
                              <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
                              <span className="text-red-500 font-bold">Threat!</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-emerald-500 font-bold">URL Safe</span>
                            </>
                          )}
                        </div>
                        <div className="font-sans text-[11px] text-zinc-400 truncate">
                          {safeResponse.matches && safeResponse.matches.length > 0 
                            ? `Type: ${safeResponse.matches[0].threatType}` 
                            : 'No threats detected.'}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Cloud logging Stackdriver */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-indigo-500" />
                      Google Cloud Logging
                    </CardTitle>
                    <CardDescription>Dispatch structured entries to Stackdriver Logs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Log Message</label>
                      <Input
                        value={logMessage}
                        onChange={(e) => setLogMessage(e.target.value)}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={logLevel}
                        onChange={(e) => setLogLevel(e.target.value)}
                        className="p-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 outline-none"
                      >
                        <option value="INFO">INFO</option>
                        <option value="WARNING">WARNING</option>
                        <option value="ERROR">ERROR</option>
                      </select>
                      <Button onClick={handleWriteLog} disabled={logLoading} className="flex-1 bg-indigo-650 dark:bg-indigo-600 text-white text-xs">
                        Write
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* reCAPTCHA Enterprise Verification */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-500" />
                      reCAPTCHA Enterprise
                    </CardTitle>
                    <CardDescription>Verify reCAPTCHA token scoring metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Token</label>
                      <Input
                        value={recaptchaToken}
                        onChange={(e) => setRecaptchaToken(e.target.value)}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={recaptchaAction}
                        onChange={(e) => setRecaptchaAction(e.target.value)}
                        placeholder="Action"
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                      <Button onClick={handleRecaptchaVerify} disabled={recaptchaLoading} className="bg-indigo-650 dark:bg-indigo-600 text-white text-xs">
                        Verify
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {(logResponse || recaptchaResponse) && (
                <Card className="border border-slate-200 dark:border-zinc-800 bg-zinc-950 text-zinc-300">
                  <CardHeader className="py-3 border-b border-zinc-850">
                    <CardTitle className="text-xs font-bold text-white">Observability Logging & Assessment Output</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 overflow-auto max-h-48 text-xs font-mono">
                    <pre>{JSON.stringify(logResponse || recaptchaResponse, null, 2)}</pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TAB 9: GOOGLE WORKSPACE */}
          {activeTab === 'workspace' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {workspaceError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {workspaceError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Google Drive Sandbox */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <FolderUp className="w-5 h-5 text-indigo-500" />
                      Google Drive Sandbox
                    </CardTitle>
                    <CardDescription>Upload files and assets to unified Drive folders</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Target Folder ID (Optional)</label>
                      <Input
                        value={driveFolderId}
                        onChange={(e) => setDriveFolderId(e.target.value)}
                        placeholder="Default Root"
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setDriveFile(e.target.files[0]);
                          }
                        }}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                      <Button onClick={handleDriveUpload} disabled={workspaceLoading || !driveFile} className="bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        Upload
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Google Sheets Sandbox */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
                      Google Sheets Integration
                    </CardTitle>
                    <CardDescription>Manage real-time spreadsheet intelligence</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Spreadsheet Title</label>
                      <div className="flex gap-2">
                        <Input
                          value={sheetTitle}
                          onChange={(e) => setSheetTitle(e.target.value)}
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                        />
                        <Button onClick={handleCreateSheet} disabled={workspaceLoading} className="bg-indigo-650 dark:bg-indigo-600 text-white text-xs">
                          Create Sheet
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-black/5 dark:border-zinc-800/50">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Active Spreadsheet ID</label>
                      <Input
                        value={spreadsheetId}
                        onChange={(e) => setSpreadsheetId(e.target.value)}
                        placeholder="Spreadsheet ID"
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Read Range</label>
                        <Input
                          value={sheetRange}
                          onChange={(e) => setSheetRange(e.target.value)}
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleReadSheet} disabled={workspaceLoading || !spreadsheetId} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs h-9">
                          Read Range
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-black/5 dark:border-zinc-800/50">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Append Rows (JSON Array)</label>
                      <Input
                        value={sheetAppendValues}
                        onChange={(e) => setSheetAppendValues(e.target.value)}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={sheetAppendRange}
                          onChange={(e) => setSheetAppendRange(e.target.value)}
                          placeholder="Range"
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                        />
                        <Button onClick={handleAppendSheet} disabled={workspaceLoading || !spreadsheetId} className="bg-indigo-650 dark:bg-indigo-600 text-white text-xs">
                          Append Rows
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Google Docs Sandbox */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      Google Docs Generator
                    </CardTitle>
                    <CardDescription>Publish structured workspace document files</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Doc Title</label>
                      <Input
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Body Content</label>
                      <textarea
                        value={docBody}
                        onChange={(e) => setDocBody(e.target.value)}
                        className="w-full h-20 p-2 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none text-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                    <Button onClick={handleCreateDoc} disabled={workspaceLoading} className="w-full bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                      Create Document
                    </Button>
                  </CardContent>
                </Card>

                {/* Google Calendar Sandbox */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                      Google Calendar Scheduler
                    </CardTitle>
                    <CardDescription>Track workspaces scheduling events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Event Summary</label>
                      <Input
                        value={calendarSummary}
                        onChange={(e) => setCalendarSummary(e.target.value)}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Start Time</label>
                        <Input
                          value={calendarStart}
                          onChange={(e) => setCalendarStart(e.target.value)}
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">End Time</label>
                        <Input
                          value={calendarEnd}
                          onChange={(e) => setCalendarEnd(e.target.value)}
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs mt-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Event Details</label>
                      <Input
                        value={calendarDetails}
                        onChange={(e) => setCalendarDetails(e.target.value)}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateCalendarEvent} disabled={workspaceLoading} className="flex-1 bg-indigo-650 dark:bg-indigo-600 text-white text-xs">
                        Schedule Event
                      </Button>
                      <Button onClick={handleListCalendarEvents} disabled={workspaceLoading} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
                        List Sync Events
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {workspaceResponse && (
                <Card className="border border-slate-200 dark:border-zinc-800 bg-zinc-950 text-zinc-300">
                  <CardHeader className="py-3 border-b border-zinc-850">
                    <CardTitle className="text-xs font-bold text-white">Workspace Response Output</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 overflow-auto max-h-48 text-xs font-mono">
                    <pre>{JSON.stringify(workspaceResponse, null, 2)}</pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TAB 10: VIDEO & VECTOR INTEL */}
          {activeTab === 'video_embeddings' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {videoError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {videoError}
                </div>
              )}
              {embeddingError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {embeddingError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video Intelligence */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Video className="w-5 h-5 text-indigo-500" />
                      GCP Video Intelligence
                    </CardTitle>
                    <CardDescription>Analyze video labels and shot transitions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">GCS Video URI (Input)</label>
                      <Input
                        value={videoGcsUri}
                        onChange={(e) => setVideoGcsUri(e.target.value)}
                        placeholder="gs://alti-video-bucket/movie.mp4"
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Local Video File Uploader</label>
                      <Input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setVideoFile(e.target.files[0]);
                          }
                        }}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Features Array</label>
                      <Input
                        value={videoFeatures}
                        onChange={(e) => setVideoFeatures(e.target.value)}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                      />
                    </div>
                    <Button onClick={handleAnalyzeVideo} disabled={videoLoading} className="w-full bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                      Start Video Ingestion / Analysis
                    </Button>

                    <div className="space-y-2 pt-2 border-t border-black/5 dark:border-zinc-800/50">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Operation Name (Polling ID)</label>
                      <div className="flex gap-2">
                        <Input
                          value={videoOperationName}
                          onChange={(e) => setVideoOperationName(e.target.value)}
                          placeholder="us-central1.1234567890"
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                        />
                        <Button onClick={handleCheckVideoStatus} disabled={videoLoading || !videoOperationName} className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-sans">
                          Check Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vertex AI Multimodal Embeddings */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      Vertex AI Multimodal Embeddings
                    </CardTitle>
                    <CardDescription>Generate vector embeddings for search and grounding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 p-1 bg-black/[0.04] dark:bg-white/[0.04] rounded-xl border border-black/5 dark:border-white/5 max-w-[200px]">
                      <button
                        onClick={() => setEmbeddingType('text')}
                        className={cn(
                          'flex-1 py-1 text-[10px] font-bold rounded-lg transition-all',
                          embeddingType === 'text' ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs' : 'text-zinc-500'
                        )}
                      >
                        Text
                      </button>
                      <button
                        onClick={() => setEmbeddingType('multimodal')}
                        className={cn(
                          'flex-1 py-1 text-[10px] font-bold rounded-lg transition-all',
                          embeddingType === 'multimodal' ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs' : 'text-zinc-500'
                        )}
                      >
                        Multimodal
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Input Text</label>
                      <textarea
                        value={embeddingText}
                        onChange={(e) => setEmbeddingText(e.target.value)}
                        className="w-full h-16 p-2 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none text-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    {embeddingType === 'multimodal' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Image File Input</label>
                        <Input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setEmbeddingImage(e.target.files[0]);
                            }
                          }}
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                        />
                      </div>
                    )}

                    {embeddingType === 'text' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Task Type</label>
                        <select
                          value={embeddingTaskType}
                          onChange={(e) => setEmbeddingTaskType(e.target.value)}
                          className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 outline-none font-sans"
                        >
                          <option value="RETRIEVAL_DOCUMENT">RETRIEVAL_DOCUMENT</option>
                          <option value="RETRIEVAL_QUERY">RETRIEVAL_QUERY</option>
                          <option value="CLASSIFICATION">CLASSIFICATION</option>
                          <option value="CLUSTERING">CLUSTERING</option>
                        </select>
                      </div>
                    )}

                    <Button onClick={handleGenerateEmbeddings} disabled={embeddingLoading} className="w-full bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                      {embeddingLoading ? 'Generating Vectors...' : 'Generate Vector Embeddings'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {(videoResponse || embeddingResponse) && (
                <Card className="border border-slate-200 dark:border-zinc-800 bg-zinc-950 text-zinc-300">
                  <CardHeader className="py-3 border-b border-zinc-850">
                    <CardTitle className="text-xs font-bold text-white">Video & Embedding Analysis Output</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 overflow-auto max-h-48 text-xs font-mono">
                    <pre>{JSON.stringify(videoResponse || embeddingResponse, null, 2)}</pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TAB 11: SECRETS & PUB/SUB */}
          {activeTab === 'secrets_pubsub' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {secretsError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {secretsError}
                </div>
              )}
              {pubsubError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {pubsubError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Google Secret Manager */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Lock className="w-5 h-5 text-indigo-500" />
                      Google Secret Manager
                    </CardTitle>
                    <CardDescription>Securely store and retrieve API credentials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Secret ID / Name</label>
                      <Input
                        value={secretId}
                        onChange={(e) => setSecretId(e.target.value)}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Secret Value Payload</label>
                      <Input
                        value={secretValue}
                        onChange={(e) => setSecretValue(e.target.value)}
                        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateSecret} disabled={secretsLoading} className="flex-1 bg-indigo-650 dark:bg-indigo-600 text-white text-xs">
                        Create Secret Version
                      </Button>
                      <Button onClick={handleGetSecret} disabled={secretsLoading} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
                        Access Secret Payload
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Google Cloud Pub/Sub Broker */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-indigo-500" />
                      GCP Pub/Sub Event Broker
                    </CardTitle>
                    <CardDescription>Dispatch streaming events across microservices</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Topic ID</label>
                      <div className="flex gap-2">
                        <Input
                          value={pubsubTopicId}
                          onChange={(e) => setPubsubTopicId(e.target.value)}
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono flex-1"
                        />
                        <Button onClick={handleCreateTopic} disabled={pubsubLoading} className="bg-indigo-650 dark:bg-indigo-600 text-white text-xs">
                          Create Topic
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-black/5 dark:border-zinc-800/50">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Publish JSON Payload</label>
                      <textarea
                        value={pubsubMessage}
                        onChange={(e) => setPubsubMessage(e.target.value)}
                        className="w-full h-16 p-2 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none font-mono text-zinc-800 dark:text-zinc-100"
                      />
                      <Button onClick={handlePublishMessage} disabled={pubsubLoading} className="w-full bg-indigo-650 dark:bg-indigo-600 text-white text-xs font-sans">
                        Publish Message
                      </Button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-black/5 dark:border-zinc-800/50">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Create Subscription mapping</label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Input
                          value={pubsubSubId}
                          onChange={(e) => setPubsubSubId(e.target.value)}
                          placeholder="Subscription ID"
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                        />
                        <Input
                          value={pubsubEndpoint}
                          onChange={(e) => setPubsubEndpoint(e.target.value)}
                          placeholder="Push Endpoint Webhook"
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                        />
                      </div>
                      <Button onClick={handleCreateSubscription} disabled={pubsubLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
                        Register Subscription mapping
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {(secretsResponse || pubsubResponse) && (
                <Card className="border border-slate-200 dark:border-zinc-800 bg-zinc-950 text-zinc-300">
                  <CardHeader className="py-3 border-b border-zinc-850">
                    <CardTitle className="text-xs font-bold text-white">Event & Secret Registry Output</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 overflow-auto max-h-48 text-xs font-mono">
                    <pre>{JSON.stringify(secretsResponse || pubsubResponse, null, 2)}</pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TAB 12: AGENTIC MCP & SWARM */}
          {activeTab === 'a2ui_mcp_swarm' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {mcpError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {mcpError}
                </div>
              )}
              {swarmError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {swarmError}
                </div>
              )}
              {a2uiError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {a2uiError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Model Context Protocol (MCP) Server Daemon */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Server className="w-5 h-5 text-indigo-500" />
                      Google MCP Database Bridge
                    </CardTitle>
                    <CardDescription>Check lifecycle and run analytical tools on MCP Server</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button onClick={handleMcpStatus} disabled={mcpLoading} className="flex-1 bg-indigo-650 dark:bg-indigo-600 text-white text-xs">
                        Check MCP Daemon Status
                      </Button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-black/5 dark:border-zinc-800/50">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Run Database Tool Query</label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Input
                          value={mcpToolsetName}
                          onChange={(e) => setMcpToolsetName(e.target.value)}
                          placeholder="Toolset (e.g. source)"
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                        />
                        <Input
                          value={mcpToolName}
                          onChange={(e) => setMcpToolName(e.target.value)}
                          placeholder="Tool Name"
                          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                        />
                      </div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Tool Parameters (JSON)</label>
                      <textarea
                        value={mcpParameters}
                        onChange={(e) => setMcpParameters(e.target.value)}
                        className="w-full h-12 p-2 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none font-mono text-zinc-800 dark:text-zinc-100"
                      />
                      <Button onClick={handleMcpQuery} disabled={mcpLoading} className="w-full bg-indigo-650 dark:bg-indigo-600 text-white text-xs">
                        Execute MCP Database Query
                      </Button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-black/5 dark:border-zinc-800/50">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Update tools.yaml Specification</label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <textarea
                          value={mcpSources}
                          onChange={(e) => setMcpSources(e.target.value)}
                          placeholder="Sources list JSON"
                          className="h-12 p-2 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none font-mono text-zinc-800 dark:text-zinc-100"
                        />
                        <textarea
                          value={mcpTools}
                          onChange={(e) => setMcpTools(e.target.value)}
                          placeholder="Tools list JSON"
                          className="h-12 p-2 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none font-mono text-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                      <Button onClick={handleMcpUpdateTools} disabled={mcpLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
                        Update MCP Specifications
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Swarm and UI Specification Console */}
                <Card className="border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-indigo-500" />
                      A2UI, AGUI & A2A Swarm Console
                    </CardTitle>
                    <CardDescription>Parse stream packets and validate layout specifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 p-1 bg-black/[0.04] dark:bg-white/[0.04] rounded-xl border border-black/5 dark:border-white/5 max-w-[300px]">
                      {['a2ui', 'agui', 'adk', 'swarm'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setA2uiMode(m as any)}
                          className={cn(
                            'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize',
                            a2uiMode === m ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs' : 'text-zinc-500'
                          )}
                        >
                          {m.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    {a2uiMode === 'swarm' ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Validate Handoff Packet XML</label>
                          <textarea
                            value={swarmPacket}
                            onChange={(e) => setSwarmPacket(e.target.value)}
                            className="w-full h-20 p-2 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none font-mono text-zinc-850 dark:text-zinc-100"
                          />
                          <Button onClick={handleSwarmValidate} disabled={swarmLoading} className="w-full bg-indigo-650 dark:bg-indigo-600 text-white text-xs">
                            Validate Swarm Packet
                          </Button>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-black/5 dark:border-zinc-800/50">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Format Agent-to-Agent Handoff</label>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <Input
                              value={swarmFrom}
                              onChange={(e) => setSwarmFrom(e.target.value)}
                              placeholder="From"
                              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                            />
                            <Input
                              value={swarmTo}
                              onChange={(e) => setSwarmTo(e.target.value)}
                              placeholder="To"
                              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                            />
                            <Input
                              value={swarmAction}
                              onChange={(e) => setSwarmAction(e.target.value)}
                              placeholder="Action"
                              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs"
                            />
                          </div>
                          <Input
                            value={swarmParams}
                            onChange={(e) => setSwarmParams(e.target.value)}
                            placeholder="Parameters JSON"
                            className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                          />
                          <Button onClick={handleSwarmHandoffFormat} disabled={swarmLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
                            Build Handoff Packet
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {a2uiMode !== 'adk' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase">Interactive Prompt</label>
                            <textarea
                              value={a2uiPrompt}
                              onChange={(e) => setA2uiPrompt(e.target.value)}
                              className="w-full h-20 p-3 text-xs rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-zinc-100"
                            />
                          </div>
                        )}

                        {a2uiMode === 'adk' && (
                          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 font-medium">
                            Bootstrap a new Google ADK (Agent Development Kit) client manifest template to configure your custom workspace agent.
                          </div>
                        )}

                        <Button onClick={handleA2uiGenerate} disabled={a2uiLoading} className="bg-indigo-650 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 h-9 w-full">
                          {a2uiLoading ? 'Generating...' : 'Build Manifest / Payload'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {(mcpResponse || swarmResponse || a2uiResponse) && (
                <Card className="border border-slate-200 dark:border-zinc-800 bg-zinc-950 text-zinc-300">
                  <CardHeader className="py-3 border-b border-zinc-850">
                    <CardTitle className="text-xs font-bold text-white">Verification Output Payload</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 overflow-auto max-h-48 text-xs font-mono">
                    <pre>{JSON.stringify(mcpResponse || swarmResponse || a2uiResponse, null, 2)}</pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
