import names from './anatomy.pt-BR.json' with {type: 'json'};

const catalogue: Record<string, string> = names;
type NamedStructure = {id:string; name:string; displayName?:string};

export function anatomicalName(structure: NamedStructure): string {
  return structure.displayName ?? catalogue[structure.id] ?? structure.name;
}

export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
}

export function matchesAnatomy(structure: NamedStructure, query: string): boolean {
  const term = normalizeSearch(query);
  return [anatomicalName(structure), structure.name, structure.id].some(value => normalizeSearch(value).includes(term));
}
