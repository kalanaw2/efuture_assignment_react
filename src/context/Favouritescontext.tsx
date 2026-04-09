"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

interface FavouritesContextType {
    favourites: number[];
    toggleFavourite: (userId: number) => void;
    isFavourite: (userId: number) => boolean;
}

const FavouritesContext = createContext<FavouritesContextType | null>(null);

export function FavouritesProvider({ children }: { children: ReactNode }) {
    const [favourites, setFavourites] = useState<number[]>([]);


    useEffect(() => {
        try {
            const stored = localStorage.getItem("favouriteUsers");
            if (stored) {
                setFavourites(JSON.parse(stored));
            }
        } catch {
            console.error("Failed to load favourite users");
        }
    }, []);


    useEffect(() => {
        localStorage.setItem("favouriteUsers", JSON.stringify(favourites));
    }, [favourites]);


    const toggleFavourite = (userId: number) => {
        console.log(userId)
        if (favourites.includes(userId)) {
            setFavourites(favourites.filter((id) => id !== userId));
        } else {
            setFavourites([...favourites, userId]);
        }
    };

    const isFavourite = (userId: number) => {
        return favourites.includes(userId);
    };

    return (
        <FavouritesContext.Provider
            value={{ favourites, toggleFavourite, isFavourite }}
        >
            {children}
        </FavouritesContext.Provider>
    );
}

export function useFavourites(): FavouritesContextType {
    const ctx = useContext(FavouritesContext);
    if (!ctx) {
        throw new Error("useFavourites must be used within FavouritesProvider");
    }
    return ctx;
}