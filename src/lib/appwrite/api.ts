import { ID, Query } from 'appwrite'
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )

        return newUser;
    } catch (error) {
        console.log(error)
    }
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailSession(user.email, user.password);

        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0]
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {
        // storage로 이미지 업로드하기
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw Error;

        // 파일 url 가져오기
        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // 태그를 배열에 넣기
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        // 게시글을 저장하기
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags
            }
        )

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        );

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

// 파일 삭제
export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return { status: 'ok' }
    } catch (error) {
        console.log(error);
    }
}

// 최근 날짜 순으로 정렬
export async function getRecentPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

// 좋아요
export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

// 저장된 게시글
export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

// 저장된 게시글 삭제
export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        )

        if (!statusCode) throw Error;

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}

// 게시글 아이디 불러오기
export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
        )

        return post;
    } catch (error) {
        console.log(error);
    }
}

// 게시글 수정
export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;

    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }

        if(hasFileToUpdate) {
            // storage로 이미지 업로드하기
            const uploadedFile = await uploadFile(post.file[0]);

            if (!uploadedFile) throw Error;
            
            const fileUrl = getFilePreview(uploadedFile.$id);
    
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
        }


        // 태그를 배열에 넣기
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        // 게시글을 저장하기
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags
            }
        )

        if (!updatedPost) {
            await deleteFile(post.imageId);
            throw Error;
        }

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

// 게시글 삭제
export async function deletePost(postId: string, imageId: string) {
    if(!postId || !imageId) throw Error;

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return { status : 'ok' }
    } catch (error) {
        console.log(error);
    }
}

// (탐색) 인기있는 게시글 10개 가져오기
export async function getInfinitePosts({ pageParam }: { pageParam: number}) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

// (탐색) 게시글 검색
export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )

        if(!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}
