'use client';

import ProductTable from '@/components/table/product-table';

export default function Products() {

    return (
        <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full flex-col items-center gap-0 py-0 px-4 bg-white dark:bg-black sm:items-start">
                <h1 className="2xs:text-4xl lg:text-6xl font-bold text-start">Products</h1>
                <ProductTable />
            </main>
        </div>
    );
}
