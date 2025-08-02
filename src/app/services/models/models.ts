// export interface Content{
//     id: number;
//     title?: string;
//     imageUrl: string;
//     description?: string;
//     doc?: Date;
// }

export interface CustomButton{
    id: number;
    label: string;
    path: string;
    imageUrl?: string;
    imageSVG?: string;
    imageLoaded?: boolean;
}

export interface Content{
    id: string;
    name: string;
    imageUrl?: string;
    description?: string;
    webContentLink?: string;
    type: string;
}

export interface User{
    firstName: string,
    lastName: string,
    nick: string,
    birthDate: string,
    age: number,
    description: string,
    gender: string,
    city: string,
    slogan: string,
    image: string,
}