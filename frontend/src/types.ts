export interface Profil {
    id: number;
    createdAt: Date;
    modifiedAt?: Date;
    name: string;
    email : string;
    phone: string;
    address: Address[];
    // A user can have multiple address but only one by default
    favoriteAddress: Address;
    contactsIds: string[];
    contactRequests: ContactRequest[];
    ignoredContacts: Request[];
    rejectedContacts: Request[];
    notes: Note[];
    reactions: Reaction[];
}

type ProfilRelations = Profil[]

export interface Note {
    id: string;
    content: string;
    creator: string;
    announces?: ProfilRelations
    announcers?: ProfilRelations
    tags: string[];
    AttachedNotesIds: string[];
    // Images join to the note
    attachedFiles: string[];
    createdAt: Date;
    modifiedAt?: Date;
    endTime?: Date;
    geoScope?: GeoScope;
    public?: boolean;
}

export interface Tag {
    id: string;
    label: string;
    createdAt: Date;
    creator: string;
    modifiedAt?:Date;
}

export enum ReactionType {
    LIKE = "like",
    DISLIKE = "dislike",
    HEART = "heart"
}

export interface Reaction {
    id: string;
    type: ReactionType;
    createdAt: number;
    creator: string;
    modifiedAt?:Date;
    attachedTo: Note;
}

export interface GeoLocalisation {
    latitude: number;
    longitude: number;
}

export interface GeoScope extends GeoLocalisation {
    radius: number; 
 }

  export interface Address extends GeoLocalisation {
    id: string;
    label: string;
    createdAt: Date;
    creator: Profil;
    modifiedAt?:Date;
}

export enum TypeRequest {
    ADD = "Add",
    IGNORE = "Ignore",
    OFFER = "guest",
    REJECT= "Reject",
    ACCEPT= "Accept"
}

export interface Request {
    id: string;
    type: TypeRequest;
    actor: Profil;
    createdAt: Date;
    modifiedAt?: Date;
}

export interface ContactRequest extends Request {
    content: string;
}




