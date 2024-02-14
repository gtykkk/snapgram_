export enum QUERY_KEYS {
    // 인증키
    CREATE_USER_ACCOUNT = 'createUserAccount',

    // 사용자키
    GET_CURRENT_USER = 'getCurrentUser',
    GET_USERS = 'getUsers',
    GET_USER_BY_ID = 'getUserById',

    // 게시글키
    GET_POSTS = 'getPosts',
    GET_INFINITE_POSTS = 'getInfinitePosts',
    GET_RECENT_POSTS = 'getRecentPosts',
    GET_POST_BY_ID = 'getPostById',
    GET_User_POSTS = 'getUserPosts',
    GET_FILE_PREVIEW = 'getFilePreview',

    // 검색키
    SEARCH_POSTS = 'getSearchPosts'
}