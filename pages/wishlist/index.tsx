import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

type Props = {};

const Wishlist: NextPage<Props> = () => {
    return (
        <>
            <WishlistHead />
            <MainLayout>
                <div className="w-full max-w-2xl flex-1 flex-col justify-center text-center">
                    <section className="w-full py-6 md:py-12">
                        <div className="container grid max-[1fr_900px] md:px-6 items-start gap-6">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-bold tracking-tighter">Wishlists</h2>
                            </div>
                            <div className="grid gap-4 md:gap-4 p-8 outlined-container">
                                <p className="text-left">
                                    This is a wishlist page.
                                </p>
                            </div>
                            <Link href={`/wishlist/${1}`}>
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>Magda's Dwarf Booty</CardTitle>
                                    <CardDescription>31 cards</CardDescription>
                                </CardHeader>
                            </Card>
                            </Link>
                            <Button className="w-full">New wishlist</Button>
                        </div>
                    </section>
                </div>
            </MainLayout>
        </>
    );
}

export default Wishlist;

const WishlistHead = () => {
    return (
        <Head>
            <title>Wishlist</title>
            <meta
                name="description"
                content="Search Magic the Gathering cards across Canada"
            />
            <meta
                property="og:title"
                content={`Snapcaster - Search Magic the Gathering cards across Canada`}
            />
            <meta
                property="og:description"
                content={`Find Magic the Gathering singles and sealed product using in Snapcaster. Search your favourite Canadian stores.`}
            />
            <meta property="og:url" content={`https://snapcaster.ca`} />
            <meta property="og:type" content="website" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
};