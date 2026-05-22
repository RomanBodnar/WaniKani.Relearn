import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type Subject } from './Subject';
import { transformSubject } from '~/utils/transformSubject';
import { API_ENDPOINTS } from '~/config/api';
import { useRouteLoaderData } from 'react-router';

interface BookmarksContextType {
    bookmarks: Subject[];
    isLoading: boolean;
    addBookmark: (subject: Subject) => Promise<void>;
    removeBookmark: (subjectId: number) => Promise<void>;
    isBookmarked: (subjectId: number) => boolean;
    fetchBookmarks: () => Promise<void>;
    isLoggedIn: boolean;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const BookmarksProvider = ({ children }: { children: ReactNode }) => {
    const [bookmarks, setBookmarks] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const rootData = useRouteLoaderData("root") as { isLoggedIn: boolean } | undefined;
    const isLoggedIn = rootData?.isLoggedIn || false;

    const fetchBookmarks = useCallback(async () => {
        try {
            const response = await fetch(API_ENDPOINTS.bookmarks, {
                credentials: 'include'
            });

            if (response.ok) {
                const apiData = await response.json();
                console.log("Bookmarks API Response:", apiData);
                
                let subjectsData: any[] = [];
                if (Array.isArray(apiData)) {
                    subjectsData = apiData;
                } else if (apiData) {
                    subjectsData = apiData.data || apiData.Data || apiData.subjects || [];
                }
                
                setBookmarks(subjectsData.map(transformSubject));
            } else {
                console.error("Failed to fetch bookmarks");
            }
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    const addBookmark = async (subject: Subject) => {
        const claims = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('X-User-Claims=')) : null;
        const isLoggedIn = !!claims && claims.split('=')[1] !== '';
        if (!isLoggedIn) return;

        // Optimistic update
        setBookmarks(prev => {
            if (prev.some(b => b.Id === subject.Id)) return prev;
            return [subject, ...prev];
        });

        try {
            const response = await fetch(API_ENDPOINTS.bookmarkSubject(subject.Id), {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Failed to add bookmark");
            }
        } catch (error) {
            console.error("Error adding bookmark:", error);
            // Revert on failure
            setBookmarks(prev => prev.filter(b => b.Id !== subject.Id));
        }
    };

    const removeBookmark = async (subjectId: number) => {
        const claims = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('X-User-Claims=')) : null;
        const isLoggedIn = !!claims && claims.split('=')[1] !== '';
        if (!isLoggedIn) return;

        // Optimistic update
        let removedSubject: Subject | undefined;
        setBookmarks(prev => {
            removedSubject = prev.find(b => b.Id === subjectId);
            return prev.filter(b => b.Id !== subjectId);
        });

        try {
            const response = await fetch(API_ENDPOINTS.bookmarkSubject(subjectId), {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Failed to remove bookmark");
            }
        } catch (error) {
            console.error("Error removing bookmark:", error);
            // Revert on failure
            if (removedSubject) {
                setBookmarks(prev => [removedSubject as Subject, ...prev]);
            }
        }
    };

    const isBookmarked = (subjectId: number) => {
        return bookmarks.some(b => b.Id === subjectId);
    };

    return (
        <BookmarksContext.Provider value={{ 
            bookmarks, 
            isLoading, 
            addBookmark, 
            removeBookmark, 
            isBookmarked,
            fetchBookmarks,
            isLoggedIn
        }}>
            {children}
        </BookmarksContext.Provider>
    );
};

export const useBookmarks = () => {
    const context = useContext(BookmarksContext);
    if (context === undefined) {
        throw new Error('useBookmarks must be used within a BookmarksProvider');
    }
    return context;
};
