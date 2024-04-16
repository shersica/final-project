export interface Game {
    gameId: number
    name: string;
    platforms: string[];
    images: string[];
    genres: string[];
    releaseDate: string; // Assuming release date is represented as a string
    rating: number;
    stores: string[];
}

export interface GameDetails {
    gameId: number
    name: string;
    platforms: string[];
    backgroundImage: string
    images: string[];
    genres: string[];
    releaseDate: string; 
    ratings: Rating[];
    stores: string[];
    description: string
    website: string
    tags: string[]
    developers: string[]
    rating: number
}

export interface Rating {
    title: string
    count: number
    percent: number
}

export interface User {
    username: string
    token?: string
    id: number
}

export interface UserLibrary {
    _id: string
    username: string
    gameId: number
    name: string;
    platforms: string[];
    backgroundImage: string
    images: string[];
    genres: string[];
    releaseDate: string; 
    ratings: Rating[];
    rating: number
    gameStatus: string
    userRating: string
}

export interface Review {
    id?: number
    gameId: number
    gameName?: string
    rating: string
    reviewer: string
    comment: string
    date?: Date
    interactions?: ReviewInteractions
    likeStats?: LikeStats
}

export interface ReviewInteractions {
    id?: number
    likes: number
    dislikes: number
    reviewId: number
}

export interface LikeStats {
    _id?: string
    reviewId?: number
    username?: string
    liked: boolean
    disliked: boolean
}

export interface UserProfile {
    _id: string
    username: string
    name?: string
    bio?: string
    profilePic: string
}

export interface UserSocials {
    id: string
    username: string
    following: string[]
    followers: string[]
}


export interface Filter {
    value: string;
    viewValue: string;
  }