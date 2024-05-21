"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createContent = async (data: any) => {
    try {
        await prisma.content.create({
            data: {
                ...data,
            },
        });

    } catch (error) {}

    revalidatePath("/dashboard/contents");
};

export const updateContent = async (id: string, data: any) => {
    try {
        await prisma.content.update({
            where: {
                id: id,
            },
            data: {
                ...data,
            },
        });
    } catch (error) {}

    revalidatePath("/dashboard/contents");
}

export const deleteContent = async (id: string) => {
    try {
        await prisma.content.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {}

    revalidatePath("/dashboard/contents");
};