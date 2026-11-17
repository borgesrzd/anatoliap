import {useState} from 'react';
import {Heart, X} from 'lucide-react';
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';

export default function WelcomeCard() {
 const [open, setOpen] = useState(true);
 return <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="welcome-card" showCloseButton={false}>
   <DialogClose render={<Button variant="ghost" className="welcome-close" aria-label="Fechar boas-vindas" />}><X size={20}/></DialogClose>
   <DialogTitle className="sr-only">Boas-vindas ao Atlas Humano</DialogTitle>
   <Heart className="welcome-heart" size={76} strokeWidth={1.4} fill="currentColor" aria-hidden="true"/>
   <DialogDescription className="welcome-message">
    Versionado, traduzido e publicado para Júlia Paiva, uma pessoa muito especial para mim.
    <span className="welcome-signature">-Pedro Borges</span>
   </DialogDescription>
  </DialogContent>
 </Dialog>;
}
