/* Reused code from my Capstone Project */
import { buttonVariants } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'react-responsive';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    paginationClassName?: string;
}

export default function PaginationComponent({
    currentPage,
    lastPage,
    onPageChange,
    paginationClassName = 'justify-end'
}: PaginationProps) {
    const is2xs = useMediaQuery({ minWidth: 320, maxWidth: 449 });

    /* Function to populate page numbers to display */
    const getPageNumbers = () => {
        const cP = currentPage;
        const lP = lastPage;

        // For few pages, show all
        if (lP <= 5) {
            return Array.from({ length: lP }, (_, i) => i + 1);
        }

        // For many pages, implement consistent 5-button pagination
        const pages = [];

        // Always show the first page
        pages.push(1);

        if (cP <= 2) {
            // Case 1: On first 2 pages, show sequential pages (1 to 5)
            for (let i = 2; i <= 5; i++) {
                pages.push(i);
            }
        } else if (cP > lP - 2) {
            // Case 2: Near the end (last 4 pages), show page 1 and last 4 pages
            for (let i = lP - 3; i <= lP; i++) {
                pages.push(i);
            }
        } else {
            // Case 3: In the middle, show page 1, then current page and surrounding pages
            // Add current page and pages around it
            for (let i = cP; i <= cP + 3; i++) {
                pages.push(i);
            }
        }

        // Remove any duplicates (in case page 1 is added twice in some edge cases)
        return [...new Set(pages)];
    };

    // For very small screens (2xs), show simplified text-only pagination
    if (is2xs) {
        return (
            <Pagination className={paginationClassName}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) {
                                    onPageChange(currentPage - 1);
                                }
                            }}
                            className={`cursor-pointer bg-gray-800 text-white ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="mx-3 text-sm text-muted-foreground">
                            Page {currentPage} of {lastPage}
                        </span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < lastPage) {
                                    onPageChange(currentPage + 1);
                                }
                            }}
                            className={`cursor-pointer bg-gray-800 text-white ${currentPage === lastPage ? 'pointer-events-none opacity-50' : ''}`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );
    }

    return (
        <Pagination className={paginationClassName}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                                onPageChange(currentPage - 1);
                            }
                        }}
                        className={`cursor-pointer bg-gray-800 hover:bg-gray-800/50 hover:text-white text-white ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                    />
                </PaginationItem>
                {getPageNumbers().map((page) => {
                    const isActive = page === currentPage;
                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page);
                                }}
                                isActive={isActive}
                                className={cn({
                                    [buttonVariants({
                                        variant: 'default',
                                        className:
                                            'cursor-pointer bg-[#ccb965] hover:bg-[#807440] text-black hover:text-white',
                                    })]: isActive,
                                    'cursor-pointer bg-secondary text-secondary-foreground hover:bg-gray-200 dark:hover:bg-gray-300 dark:hover:text-background':
                                        !isActive,
                                })}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                <PaginationItem>
                    <PaginationNext
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < lastPage) {
                                onPageChange(currentPage + 1);
                            }
                        }}
                        className={`cursor-pointer bg-gray-800 hover:bg-gray-800/50 hover:text-white text-white ${currentPage === lastPage ? 'pointer-events-none opacity-50' : ''}`}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}