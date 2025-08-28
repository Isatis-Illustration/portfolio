export interface ClaudinaryImage{
    url: string,
    context: Context
}

export interface Context{
    caption?: string,  //titolo
    alt?: string,       //descrizione
    position?: string,
    type?: string,
}


export interface Content{
    id: number;
    title: string;
    imageUrl?: string;
    description?: string;
    webContentLink?: string;
    type: string;
    isGif: boolean;
    position: number;
}


export interface User{
    nick: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    description: Description,
    image: string,
    email: Email,
    instagram: Instagram,
    telegram: Telegram,
}


export interface Instagram{
    nick: string,
    link: string,
    icon: string,
}

export interface Email{
    email: string,
    subject: string,
    body: string,
    icon: string,
}


export interface Telegram{
    nick: string,
    link: string,
    icon: string,
}


export interface Description{
    it: string,
    en: string,
}


export interface Sticker{
    imageUrl: string;
    x: number; 
    y: number; 
    rotation: number; 
    fade?: boolean
}


export interface CustomButton{
    id: number;
    label: string;
    path: string;
    imageUrl?: string;
    imageSVG?: string;
    imageLoaded?: boolean;
}
