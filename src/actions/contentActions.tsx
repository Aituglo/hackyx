"use server";
import prisma from "@/lib/prisma";
import { fetchContentFromURL } from "@/lib/indexer";
import { getServerSession } from "next-auth";
import { addContentToTypesense, contentExists } from "@/lib/typesense";
import { authOptions } from "@/lib/auth-options";

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

export const createPublicContent = async (data: any) => {
    if (!data.captcha) {
        return { error: "Captcha token is missing" };
    }

    const formData = new FormData();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', data.captcha);

    const captchaVerificationResponse = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
        method: 'POST',
        body: formData
    });
    const captchaVerificationData = await captchaVerificationResponse.json();

    if (!captchaVerificationData.success) {
        return { error: "Captcha verification failed" };
    } 

    // @ts-ignore
    const { captcha, ...dataWithoutCaptcha } = data;

    const alreadyExists = await contentExists(dataWithoutCaptcha.url);
    if (alreadyExists) return { error: "Content already indexed" };

    try {
        await prisma.content.create({
            data: dataWithoutCaptcha,
        });
        return { success: true };

    } catch (error) {
        return { error: "An error occurred" };
    }
};

export const createContent = async (data: any) => {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    const alreadyExists = await contentExists(data.url);
    if (alreadyExists) return { error: "Content already indexed" };

    try {
        await prisma.content.create({
            data: {
                ...data,
            },
        });
        return { success: true };

    } catch (error) {
        return { error: "An error occurred" };
    }

};

export const updateContent = async (id: string, data: any) => {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    const alreadyExists = await contentExists(data.url);
    if (alreadyExists) return { error: "Content already indexed" };

    try {
        await prisma.content.update({
            where: {
                id: id,
            },
            data: {
                ...data,
            },
        });
        return { success: true };
    } catch (error) {
        return { error: "An error occurred" };
    }
}

export const deleteContent = async (id: string) => {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    try {
        await prisma.content.delete({
            where: {
                id: id,
            },
        });
        return { success: true };

    } catch (error) {
        return { error: "An error occurred" };
    }
};

export const indexContent = async (content: any) => {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    try {
        const contentText = await fetchContentFromURL(content.url);
        if (!contentText) return { error: "An error occurred during indexing" };

        const addedToTypesense = await addContentToTypesense({
            url: content.url,
            content: contentText,
            title: content.title,
            description: content.description,
            tags: content.tags,
            program: content.program,
            cve: content.cve,
            source: content.source,
            cwe: content.cwe
        });

        if (!addedToTypesense) {
            return { error: "Failed to add content to Typesense" };
        }

        await prisma.content.delete({
            where: {
                id: content.id
            }
        });

        return { success: true };
    } catch (error) {
        console.log(error)
        return { error: "An error occurred during indexing" };
    }
};

export const indexMultipleContent = async (contents: any[]) => {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    try {
        for (const content of contents) {
            await indexContent(content);
        }
        return { success: true };
    } catch (error) {
        return { error: "An error occurred during indexing" };
    }
};

export const deleteMultipleContent = async (contents: any[]) => {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    try {
        for (const content of contents) {
            await prisma.content.delete({
                where: {
                    id: content.id,
                },
            });
        }
        return { success: true };
    } catch (error) {
        return { error: "An error occurred during deletion" };
    }
};