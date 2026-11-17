import {anatomicalName, matchesAnatomy} from './localization.ts';
import type {Atlas,Concept} from './anatomy';
type Tool={name:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean};execute:(input:unknown)=>unknown};
function record(input:unknown):Record<string,unknown>{if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Era esperado um objeto.');return input as Record<string,unknown>;}
export function atlasTools(atlas:Atlas,inspect:(concept:Concept)=>void):Tool[]{return [
 {name:'find_anatomy',description:'Busque estruturas anatômicas pelo nome em português, inglês ou identificador original.',inputSchema:{type:'object',properties:{query:{type:'string',minLength:1}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true},execute(input){const data=record(input);if(typeof data.query!=='string'||!data.query.trim())throw new Error('Informe um termo de busca.');const q=data.query.toLowerCase().trim();return atlas.concepts.filter(c=>matchesAnatomy(c,q)).slice(0,30).map(c=>({id:c.id,name:anatomicalName(c),pieces:c.elements.length}));}},
 {name:'inspect_anatomical_structure',description:'Selecione um conceito na anatomia 3D e abra seu painel de detalhes.',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){const data=record(input);if(typeof data.id!=='string')throw new Error('Informe um identificador do atlas.');const concept=atlas.concepts.find(c=>c.id===data.id);if(!concept)throw new Error('Esta estrutura não está presente neste atlas.');inspect(concept);return {id:concept.id,name:anatomicalName(concept),selectedPieces:concept.elements.length};}}
 ];}
export function registerAtlasTools(atlas:Atlas,inspect:(concept:Concept)=>void){
 const context=(document as Document&{modelContext?:{registerTool:(tool:Tool,options:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;
 if(!context?.registerTool)return;const lifecycle=new AbortController();
 for(const tool of atlasTools(atlas,inspect)){try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* Optional browser capability; the visible UI remains available. */}}
 return()=>lifecycle.abort();
}
