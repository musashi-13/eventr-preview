'use client'
import Categories from "@/app/_components/categories-list";
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const searchParams = useSearchParams();
    const category = searchParams.get('cat');

    return (
        <div className="w-full flex flex-col items-center md:p-4 lg:p-8">
            <Categories page='categories'/>
            <div>
                <p>View all {category}</p>
            </div>
        </div>
    );
}