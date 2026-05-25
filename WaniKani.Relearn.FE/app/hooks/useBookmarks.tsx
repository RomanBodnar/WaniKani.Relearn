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
    const [isLoggedInState, setIsLoggedInState] = useState(rootData?.isLoggedIn || false);

    useEffect(() => {
        setIsLoggedInState(rootData?.isLoggedIn || false);
    }, [rootData?.isLoggedIn]);

    const fetchBookmarks = useCallback(async () => {
        if (!rootData?.isLoggedIn) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.bookmarks, {
                credentials: 'include'
            });

            if (response.ok) {
                const apiData = await response.json();
                
                let subjectsData: any[] = [];
                if (Array.isArray(apiData)) {
                    subjectsData = apiData;
                } else if (apiData) {
                    subjectsData = apiData.data || apiData.Data || apiData.subjects || [];
                }
                
                setBookmarks(subjectsData.map(transformSubject));
            } else if (response.status === 401 || response.status === 403) {
                console.error("Session expired or unauthorized");
                setIsLoggedInState(false);
                if (typeof document !== 'undefined') {
                    document.cookie = "X-User-Claims=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                }
            } else {
                console.error("Failed to fetch bookmarks");
            }
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
        } finally {
            setIsLoading(false);
        }
    }, [rootData?.isLoggedIn]);

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    const addBookmark = async (subject: Subject) => {
        if (!isLoggedInState) return;

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
                if (response.status === 401 || response.status === 403) {
                    setIsLoggedInState(false);
                    if (typeof document !== 'undefined') {
                        document.cookie = "X-User-Claims=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    }
                }
                throw new Error("Failed to add bookmark");
            }
        } catch (error) {
            console.error("Error adding bookmark:", error);
            // Revert on failure
            setBookmarks(prev => prev.filter(b => b.Id !== subject.Id));
        }
    };

    const removeBookmark = async (subjectId: number) => {
        if (!isLoggedInState) return;

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
                if (response.status === 401 || response.status === 403) {
                    setIsLoggedInState(false);
                    if (typeof document !== 'undefined') {
                        document.cookie = "X-User-Claims=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    }
                }
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
            isLoggedIn: isLoggedInState
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
