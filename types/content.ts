export type Content =  {
  id: string;
  title?: string;
  url: string;
  description?: string; 
  content?: string;
  tags?: string[];
  program?: string;
  source?: string;
  cwe?: string; 
  cve?: string;
  indexed: boolean;
  parsed: boolean;
}
