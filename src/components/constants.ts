import { OPTIONS } from '@/types/conversation';
import {
  AudioLines,
  Brain,
  ChartArea,
  Code,
  FileCheck,
  FileMinus,
  FileText,
  Languages,
  Mail,
  Microscope,
  Minimize,
  Newspaper,
  NotebookPen,
  NotebookText,
  NotepadText,
  PencilLine,
  PencilRuler,
  Waypoints
} from 'lucide-react';

export const ALLOWED_DOC_EXTENSIONS = [
  '.pdf',
  '.docx',
  '.doc',
  '.txt',
  '.xlsx',
  '.xls',
  '.pptx',
  '.ppt',
];

export const TOOLBAR_ITEMS = [
  {
    type: OPTIONS.RESEARCH,
    label: 'Deep Research',
    Icon: Microscope,
  },
  {
    type: OPTIONS.Transcribe,
    label: 'Transcribe Audio',
    Icon: AudioLines,
  },
  // {
  //   type: OPTIONS.IMAGE,
  //   label: 'Create Image',
  //   Icon: ImageIcon,
  // },
  // {
  //   type: OPTIONS.EDIT_IMAGE,
  //   label: 'Edit Image',
  //   Icon: ImageUp,
  // },
  {
    type: OPTIONS.CODE,
    label: 'Write Code',
    Icon: Code,
  },
  {
    type: OPTIONS.ARTICLE,
    label: 'Write Article',
    Icon: Newspaper,
  },
  {
    type: OPTIONS.WRITE_CONTRACT,
    label: 'Write Contract',
    Icon: NotebookText,
  },
  {
    type: OPTIONS.REVIEW_CONTRACT,
    label: 'Review Contract',
    Icon: NotepadText,
  },
  {
    type: OPTIONS.GENERATE_PLAN,
    label: 'Create Plan',
    Icon: Waypoints,
  },
  // {
  //   type: OPTIONS.PRESENTATION,
  //   label: 'Generate Presentation',
  //   Icon: Presentation,
  // },
  {
    type: OPTIONS.GENERATE_REPORT,
    label: 'Generate Report',
    Icon: FileMinus,
  },
  {
    type: OPTIONS.GENERATE_CHART,
    label: 'Create Chart',
    Icon: ChartArea,
  },
  {
    type: OPTIONS.DRAFT_DOCUMENT,
    label: 'Draft Document',
    Icon: PencilLine,
  },
  {
    type: OPTIONS.REVIEW_DOCUMENTS,
    label: 'Review Document',
    Icon: FileText,
  },
  {
    type: OPTIONS.DRAFT_EMAIL,
    label: 'Draft Email',
    Icon: Mail,
  },
  {
    type: OPTIONS.CREATIVE_WRITING,
    label: 'Creative Writing',
    Icon: NotebookPen,
  },

  {
    type: OPTIONS.SUMMARIZE,
    label: 'Summarize',
    Icon: FileCheck,
  },
  {
    type: OPTIONS.TRANSLATE_DOCUMENTS,
    label: 'Translate',
    Icon: Languages,
  },
  {
    type: OPTIONS.EXTRACT_DATA,
    label: 'Analyze',
    Icon: Minimize,
  },
  {
    type: OPTIONS.REWRITE,
    label: 'Rewrite',
    Icon: PencilRuler,
  },
  {
    type: OPTIONS.BRAINSTORM,
    label: 'Brainstorm',
    Icon: Brain,
  },
];
