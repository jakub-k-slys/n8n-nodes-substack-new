import * as t from 'io-ts';

/**
 * io-ts codecs and inferred types for Substack Gateway REST API response shapes.
 */

declare const GatewayProfileC: t.IntersectionC<[t.TypeC<{
    id: t.NumberC;
    handle: t.StringC;
    name: t.StringC;
    url: t.StringC;
    avatar_url: t.StringC;
}>, t.PartialC<{
    bio: t.UnionC<[t.StringC, t.NullC]>;
}>]>;
type GatewayProfile = t.TypeOf<typeof GatewayProfileC>;
declare const GatewayNoteC: t.TypeC<{
    id: t.NumberC;
    body: t.StringC;
    likes_count: t.NumberC;
    author: t.TypeC<{
        id: t.NumberC;
        name: t.StringC;
        handle: t.StringC;
        avatar_url: t.StringC;
    }>;
    published_at: t.StringC;
}>;
type GatewayNote = t.TypeOf<typeof GatewayNoteC>;
declare const GatewayCreateNoteResponseC: t.TypeC<{
    id: t.NumberC;
}>;
type GatewayCreateNoteResponse = t.TypeOf<typeof GatewayCreateNoteResponseC>;
declare const GatewayPostC: t.IntersectionC<[t.TypeC<{
    id: t.NumberC;
    title: t.StringC;
    published_at: t.StringC;
}>, t.PartialC<{
    subtitle: t.UnionC<[t.StringC, t.NullC]>;
    truncated_body: t.UnionC<[t.StringC, t.NullC]>;
}>]>;
type GatewayPost = t.TypeOf<typeof GatewayPostC>;
declare const GatewayFullPostC: t.IntersectionC<[t.TypeC<{
    id: t.NumberC;
    title: t.StringC;
    slug: t.StringC;
    url: t.StringC;
    published_at: t.StringC;
}>, t.PartialC<{
    subtitle: t.UnionC<[t.StringC, t.NullC]>;
    html_body: t.UnionC<[t.StringC, t.NullC]>;
    markdown: t.UnionC<[t.StringC, t.NullC]>;
    truncated_body: t.UnionC<[t.StringC, t.NullC]>;
    reactions: t.UnionC<[t.RecordC<t.StringC, t.NumberC>, t.NullC]>;
    restacks: t.UnionC<[t.NumberC, t.NullC]>;
    tags: t.UnionC<[t.ArrayC<t.StringC>, t.NullC]>;
    cover_image: t.UnionC<[t.StringC, t.NullC]>;
}>]>;
type GatewayFullPost = t.TypeOf<typeof GatewayFullPostC>;
declare const GatewayCommentC: t.TypeC<{
    id: t.NumberC;
    body: t.StringC;
    is_admin: t.BooleanC;
}>;
type GatewayComment = t.TypeOf<typeof GatewayCommentC>;
declare const GatewayFollowingUserC: t.TypeC<{
    id: t.NumberC;
    handle: t.StringC;
}>;
type GatewayFollowingUser = t.TypeOf<typeof GatewayFollowingUserC>;

interface GatewayCredentials {
    token: string;
    publicationUrl: string;
}
declare class HttpClient {
    private readonly httpClient;
    constructor(baseUrl: string, creds: GatewayCredentials, maxRequestsPerSecond?: number);
    get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T>;
    post<T>(path: string, data?: unknown): Promise<T>;
    put<T>(path: string, data?: unknown): Promise<T>;
    delete(path: string): Promise<void>;
}

declare class PostService {
    private readonly client;
    constructor(client: HttpClient);
    getPostById(id: number): Promise<GatewayFullPost>;
    getPostsForProfile(slug: string, options: {
        limit: number;
        offset: number;
    }): Promise<GatewayPost[]>;
}

interface PaginatedNotes {
    notes: GatewayNote[];
    nextCursor?: string | null;
}
declare class NoteService {
    private readonly client;
    constructor(client: HttpClient);
    getNoteById(id: number): Promise<GatewayNote>;
    getNotesForLoggedUser(options?: {
        cursor?: string;
    }): Promise<PaginatedNotes>;
    getNotesForProfile(slug: string, options?: {
        cursor?: string;
    }): Promise<PaginatedNotes>;
}

declare class ProfileService {
    private readonly client;
    constructor(client: HttpClient);
    getOwnProfile(): Promise<GatewayProfile>;
    getProfileBySlug(slug: string): Promise<GatewayProfile>;
}

declare class CommentService {
    private readonly client;
    constructor(client: HttpClient);
    getCommentsForPost(postId: number): Promise<GatewayComment[]>;
}

declare class FollowingService {
    private readonly client;
    constructor(client: HttpClient);
    getFollowing(): Promise<GatewayFollowingUser[]>;
}

declare class NewNoteService {
    private readonly client;
    constructor(client: HttpClient);
    publishNote(content: string, attachment?: string): Promise<GatewayCreateNoteResponse>;
}

declare class Comment {
    private readonly rawData;
    readonly id: number;
    readonly body: string;
    readonly isAdmin?: boolean;
    constructor(rawData: GatewayComment);
}

interface Post {
    readonly id: number;
    readonly title: string;
    readonly subtitle: string;
    readonly body: string;
    readonly truncatedBody: string;
    readonly publishedAt: Date;
    comments(options?: {
        limit?: number;
    }): AsyncIterable<Comment>;
    like(): Promise<void>;
    addComment(data: {
        body: string;
    }): Promise<Comment>;
}
declare class PreviewPost implements Post {
    private readonly commentService;
    private readonly postService;
    readonly id: number;
    readonly title: string;
    readonly subtitle: string;
    readonly body: string;
    readonly truncatedBody: string;
    readonly publishedAt: Date;
    constructor(rawData: GatewayPost, commentService: CommentService, postService: PostService);
    fullPost(): Promise<FullPost>;
    comments(options?: {
        limit?: number;
    }): AsyncIterable<Comment>;
    like(): Promise<void>;
    addComment(_data: {
        body: string;
    }): Promise<Comment>;
}
declare class FullPost implements Post {
    private readonly commentService;
    readonly id: number;
    readonly title: string;
    readonly subtitle: string;
    readonly body: string;
    readonly truncatedBody: string;
    readonly publishedAt: Date;
    readonly htmlBody: string;
    readonly markdown: string;
    readonly slug: string;
    readonly createdAt: Date;
    readonly reactions?: Record<string, number>;
    readonly restacks?: number;
    readonly postTags?: string[];
    readonly coverImage?: string;
    readonly url: string;
    constructor(rawData: GatewayFullPost, commentService: CommentService);
    comments(options?: {
        limit?: number;
    }): AsyncIterable<Comment>;
    like(): Promise<void>;
    addComment(_data: {
        body: string;
    }): Promise<Comment>;
}

declare class Note {
    private readonly rawData;
    readonly id: number;
    readonly body: string;
    readonly likesCount: number;
    readonly author: {
        id: number;
        name: string;
        handle: string;
        avatarUrl: string;
    };
    readonly publishedAt: Date;
    constructor(rawData: GatewayNote);
}

declare class Profile {
    protected readonly rawData: GatewayProfile;
    protected readonly postService: PostService;
    protected readonly noteService: NoteService;
    protected readonly commentService: CommentService;
    protected readonly perPage: number;
    readonly id: number;
    readonly slug: string;
    readonly handle: string;
    readonly name: string;
    readonly url: string;
    readonly avatarUrl: string;
    readonly bio?: string;
    constructor(rawData: GatewayProfile, postService: PostService, noteService: NoteService, commentService: CommentService, perPage: number);
    posts(options?: {
        limit?: number;
    }): AsyncIterable<PreviewPost>;
    notes(options?: {
        limit?: number;
    }): AsyncIterable<Note>;
}

declare class OwnProfile extends Profile {
    private readonly profileService;
    private readonly followingService;
    private readonly newNoteService;
    constructor(rawData: GatewayProfile, postService: PostService, noteService: NoteService, commentService: CommentService, profileService: ProfileService, followingService: FollowingService, newNoteService: NewNoteService, perPage: number);
    publishNote(content: string, options?: {
        attachment?: string;
    }): Promise<GatewayCreateNoteResponse>;
    following(options?: {
        limit?: number;
    }): AsyncIterable<Profile>;
    notes(options?: {
        limit?: number;
    }): AsyncIterable<Note>;
}

/**
 * Configuration interfaces for the Substack Gateway client
 */
interface SubstackConfig {
    gatewayUrl?: string;
    publicationUrl: string;
    token: string;
    perPage?: number;
    maxRequestsPerSecond?: number;
}
interface PaginationParams {
    limit?: number;
    offset?: number;
}
interface SearchParams extends PaginationParams {
    query: string;
    sort?: 'top' | 'new';
    author?: string;
}

/**
 * Domain interfaces for iterator options and user-facing types
 */
interface PostsIteratorOptions {
    limit?: number;
}
interface CommentsIteratorOptions {
    postId?: number;
    limit?: number;
}
interface NotesIteratorOptions {
    limit?: number;
}

declare class SubstackClient {
    private readonly client;
    private readonly postService;
    private readonly noteService;
    private readonly profileService;
    private readonly commentService;
    private readonly followingService;
    private readonly connectivityService;
    private readonly newNoteService;
    private readonly perPage;
    constructor(config: SubstackConfig);
    testConnectivity(): Promise<boolean>;
    ownProfile(): Promise<OwnProfile>;
    profileForSlug(slug: string): Promise<Profile>;
    postForId(id: number): Promise<FullPost>;
    noteForId(id: number): Promise<Note>;
}

export { Comment, FullPost, Note, OwnProfile, PreviewPost, Profile, SubstackClient };
export type { CommentsIteratorOptions, GatewayCreateNoteResponse, NotesIteratorOptions, PaginationParams, PostsIteratorOptions, SearchParams, SubstackConfig };
