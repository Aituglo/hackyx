export type Content =  {
  id: string;
  title: string;
  url: string;
  description?: string; 
  tags: string[];
  program?: string;
  source?: string;
  cwe?: string; 
  cve?: string;
  indexed: boolean;
}
