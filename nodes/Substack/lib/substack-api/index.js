'use strict';

var axios = require('axios');
var rateLimit = require('axios-rate-limit');
var t = require('io-ts');
var _function = require('fp-ts/function');
var Either = require('fp-ts/Either');
var PathReporter = require('io-ts/PathReporter');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var t__namespace = /*#__PURE__*/_interopNamespaceDefault(t);

/**
 * HTTP client for the Substack Gateway proxy
 *
 * All requests are authenticated via a base64-encoded JSON Bearer token
 * (containing substack_sid and connect_sid) and the x-publication-url header.
 */
class HttpClient {
    constructor(baseUrl, creds, maxRequestsPerSecond = 25) {
        const token = creds.token;
        const instance = axios.create({
            baseURL: baseUrl,
            headers: {
                Authorization: `Bearer ${token}`,
                'x-publication-url': creds.publicationUrl,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        this.httpClient = rateLimit(instance, {
            maxRequests: maxRequestsPerSecond,
            perMilliseconds: 1000
        });
    }
    async get(path, params) {
        const response = await this.httpClient.get(path, { params });
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.data;
    }
    async post(path, data) {
        const response = await this.httpClient.post(path, data);
        if (response.status !== 200 && response.status !== 201) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.data;
    }
    async put(path, data) {
        const response = await this.httpClient.put(path, data);
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.data;
    }
    async delete(path) {
        const response = await this.httpClient.delete(path);
        if (response.status !== 200 && response.status !== 204) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    }
}

class Comment {
    constructor(rawData) {
        this.rawData = rawData;
        this.id = rawData.id;
        this.body = rawData.body;
        this.isAdmin = rawData.is_admin;
    }
}

class PreviewPost {
    constructor(rawData, commentService, postService) {
        this.commentService = commentService;
        this.postService = postService;
        this.id = rawData.id;
        this.title = rawData.title;
        this.subtitle = rawData.subtitle || '';
        this.truncatedBody = rawData.truncated_body || '';
        this.body = rawData.truncated_body || '';
        this.publishedAt = new Date(rawData.published_at);
    }
    async fullPost() {
        try {
            const fullPostData = await this.postService.getPostById(this.id);
            return new FullPost(fullPostData, this.commentService);
        }
        catch (error) {
            throw new Error(`Failed to fetch full post ${this.id}: ${error.message}`);
        }
    }
    async *comments(options = {}) {
        try {
            const commentsData = await this.commentService.getCommentsForPost(this.id);
            let count = 0;
            for (const commentData of commentsData) {
                if (options.limit && count >= options.limit)
                    break;
                yield new Comment(commentData);
                count++;
            }
        }
        catch (error) {
            throw new Error(`Failed to get comments for post ${this.id}: ${error.message}`);
        }
    }
    async like() {
        throw new Error('Post liking not implemented yet - requires like API');
    }
    async addComment(_data) {
        throw new Error('Comment creation not implemented yet - requires comment creation API');
    }
}
class FullPost {
    constructor(rawData, commentService) {
        var _a, _b, _c, _d;
        this.commentService = commentService;
        this.id = rawData.id;
        this.title = rawData.title;
        this.subtitle = rawData.subtitle || '';
        this.truncatedBody = rawData.truncated_body || '';
        this.body = rawData.html_body || rawData.truncated_body || '';
        this.publishedAt = new Date(rawData.published_at);
        this.url = rawData.url;
        this.htmlBody = rawData.html_body || '';
        this.markdown = rawData.markdown || '';
        this.slug = rawData.slug;
        this.createdAt = new Date(rawData.published_at);
        this.reactions = (_a = rawData.reactions) !== null && _a !== void 0 ? _a : undefined;
        this.restacks = (_b = rawData.restacks) !== null && _b !== void 0 ? _b : undefined;
        this.postTags = (_c = rawData.tags) !== null && _c !== void 0 ? _c : undefined;
        this.coverImage = (_d = rawData.cover_image) !== null && _d !== void 0 ? _d : undefined;
    }
    async *comments(options = {}) {
        try {
            const commentsData = await this.commentService.getCommentsForPost(this.id);
            let count = 0;
            for (const commentData of commentsData) {
                if (options.limit && count >= options.limit)
                    break;
                yield new Comment(commentData);
                count++;
            }
        }
        catch (error) {
            throw new Error(`Failed to get comments for post ${this.id}: ${error.message}`);
        }
    }
    async like() {
        throw new Error('Post liking not implemented yet - requires like API');
    }
    async addComment(_data) {
        throw new Error('Comment creation not implemented yet - requires comment creation API');
    }
}

class Note {
    constructor(rawData) {
        this.rawData = rawData;
        this.id = rawData.id;
        this.body = rawData.body;
        this.likesCount = rawData.likes_count;
        this.publishedAt = new Date(rawData.published_at);
        this.author = {
            id: rawData.author.id,
            name: rawData.author.name,
            handle: rawData.author.handle,
            avatarUrl: rawData.author.avatar_url
        };
    }
}

class Profile {
    constructor(rawData, postService, noteService, commentService, perPage) {
        var _a;
        this.rawData = rawData;
        this.postService = postService;
        this.noteService = noteService;
        this.commentService = commentService;
        this.perPage = perPage;
        this.id = rawData.id;
        this.slug = rawData.handle;
        this.handle = rawData.handle;
        this.name = rawData.name;
        this.url = rawData.url;
        this.avatarUrl = rawData.avatar_url;
        this.bio = (_a = rawData.bio) !== null && _a !== void 0 ? _a : undefined;
    }
    async *posts(options = {}) {
        try {
            let offset = 0;
            let totalYielded = 0;
            while (true) {
                const postsData = await this.postService.getPostsForProfile(this.slug, {
                    limit: this.perPage,
                    offset
                });
                if (!postsData || postsData.length === 0) {
                    break;
                }
                for (const postData of postsData) {
                    if (options.limit && totalYielded >= options.limit) {
                        return;
                    }
                    yield new PreviewPost(postData, this.commentService, this.postService);
                    totalYielded++;
                }
                if (postsData.length < this.perPage) {
                    break;
                }
                offset += this.perPage;
            }
        }
        catch (_a) {
            yield* [];
        }
    }
    async *notes(options = {}) {
        try {
            let cursor = undefined;
            let totalYielded = 0;
            while (true) {
                const paginatedNotes = await this.noteService.getNotesForProfile(this.slug, { cursor });
                for (const item of paginatedNotes.notes) {
                    if (options.limit && totalYielded >= options.limit) {
                        return;
                    }
                    yield new Note(item);
                    totalYielded++;
                }
                if (!paginatedNotes.nextCursor) {
                    break;
                }
                cursor = paginatedNotes.nextCursor;
            }
        }
        catch (_a) {
            yield* [];
        }
    }
}

class OwnProfile extends Profile {
    constructor(rawData, postService, noteService, commentService, profileService, followingService, newNoteService, perPage) {
        super(rawData, postService, noteService, commentService, perPage);
        this.profileService = profileService;
        this.followingService = followingService;
        this.newNoteService = newNoteService;
    }
    async publishNote(content, options) {
        return this.newNoteService.publishNote(content, options === null || options === void 0 ? void 0 : options.attachment);
    }
    async *following(options = {}) {
        const followingUsers = await this.followingService.getFollowing();
        let count = 0;
        for (const user of followingUsers) {
            if (options.limit && count >= options.limit)
                break;
            try {
                const profileData = await this.profileService.getProfileBySlug(user.handle);
                yield new Profile(profileData, this.postService, this.noteService, this.commentService, this.perPage);
                count++;
            }
            catch (_a) {
                /* empty */
            }
        }
    }
    async *notes(options = {}) {
        try {
            let cursor = undefined;
            let totalYielded = 0;
            while (true) {
                const paginatedNotes = await this.noteService.getNotesForLoggedUser({ cursor });
                for (const noteData of paginatedNotes.notes) {
                    if (options.limit && totalYielded >= options.limit) {
                        return;
                    }
                    yield new Note(noteData);
                    totalYielded++;
                }
                if (!paginatedNotes.nextCursor) {
                    break;
                }
                cursor = paginatedNotes.nextCursor;
            }
        }
        catch (_a) {
            yield* [];
        }
    }
}

/**
 * io-ts codecs and inferred types for Substack Gateway REST API response shapes.
 */
// ------------------------------------------------------------------
// Profile
// ------------------------------------------------------------------
const GatewayProfileC = t__namespace.intersection([
    t__namespace.type({
        id: t__namespace.number,
        handle: t__namespace.string,
        name: t__namespace.string,
        url: t__namespace.string,
        avatar_url: t__namespace.string
    }),
    t__namespace.partial({
        bio: t__namespace.union([t__namespace.string, t__namespace.null])
    })
]);
// ------------------------------------------------------------------
// Notes
// ------------------------------------------------------------------
const GatewayNoteAuthorC = t__namespace.type({
    id: t__namespace.number,
    name: t__namespace.string,
    handle: t__namespace.string,
    avatar_url: t__namespace.string
});
const GatewayNoteC = t__namespace.type({
    id: t__namespace.number,
    body: t__namespace.string,
    likes_count: t__namespace.number,
    author: GatewayNoteAuthorC,
    published_at: t__namespace.string
});
const GatewayNotesPageC = t__namespace.intersection([
    t__namespace.type({ items: t__namespace.array(GatewayNoteC) }),
    t__namespace.partial({ next_cursor: t__namespace.union([t__namespace.string, t__namespace.null]) })
]);
const GatewayCreateNoteResponseC = t__namespace.type({ id: t__namespace.number });
// ------------------------------------------------------------------
// Posts
// ------------------------------------------------------------------
const GatewayPostC = t__namespace.intersection([
    t__namespace.type({
        id: t__namespace.number,
        title: t__namespace.string,
        published_at: t__namespace.string
    }),
    t__namespace.partial({
        subtitle: t__namespace.union([t__namespace.string, t__namespace.null]),
        truncated_body: t__namespace.union([t__namespace.string, t__namespace.null])
    })
]);
const GatewayPostsPageC = t__namespace.intersection([
    t__namespace.type({ items: t__namespace.array(GatewayPostC) }),
    t__namespace.partial({ next_cursor: t__namespace.union([t__namespace.string, t__namespace.null]) })
]);
const GatewayFullPostC = t__namespace.intersection([
    t__namespace.type({
        id: t__namespace.number,
        title: t__namespace.string,
        slug: t__namespace.string,
        url: t__namespace.string,
        published_at: t__namespace.string
    }),
    t__namespace.partial({
        subtitle: t__namespace.union([t__namespace.string, t__namespace.null]),
        html_body: t__namespace.union([t__namespace.string, t__namespace.null]),
        markdown: t__namespace.union([t__namespace.string, t__namespace.null]),
        truncated_body: t__namespace.union([t__namespace.string, t__namespace.null]),
        reactions: t__namespace.union([t__namespace.record(t__namespace.string, t__namespace.number), t__namespace.null]),
        restacks: t__namespace.union([t__namespace.number, t__namespace.null]),
        tags: t__namespace.union([t__namespace.array(t__namespace.string), t__namespace.null]),
        cover_image: t__namespace.union([t__namespace.string, t__namespace.null])
    })
]);
// ------------------------------------------------------------------
// Comments
// ------------------------------------------------------------------
const GatewayCommentC = t__namespace.type({
    id: t__namespace.number,
    body: t__namespace.string,
    is_admin: t__namespace.boolean
});
const GatewayCommentsResponseC = t__namespace.type({
    items: t__namespace.array(GatewayCommentC)
});
// ------------------------------------------------------------------
// Following
// ------------------------------------------------------------------
const GatewayFollowingUserC = t__namespace.type({
    id: t__namespace.number,
    handle: t__namespace.string
});
const GatewayFollowingResponseC = t__namespace.type({
    items: t__namespace.array(GatewayFollowingUserC)
});

/**
 * Utility functions for runtime validation using io-ts and fp-ts
 */
/**
 * Decode and validate data using an io-ts codec
 * @param codec - The io-ts codec to use for validation
 * @param data - The raw data to validate
 * @param errorContext - Context information for error messages
 * @returns The validated data
 * @throws {Error} If validation fails
 */
function decodeOrThrow(codec, data, errorContext) {
    const result = codec.decode(data);
    return _function.pipe(result, Either.fold((_errors) => {
        const errorMessage = PathReporter.PathReporter.report(result).join(', ');
        console.log(`Invalid ${errorContext}: ${errorMessage}`);
        throw new Error(`Invalid ${errorContext}: ${errorMessage}`);
    }, (parsed) => parsed));
}

class PostService {
    constructor(client) {
        this.client = client;
    }
    async getPostById(id) {
        const raw = await this.client.get(`/posts/${id}`);
        return decodeOrThrow(GatewayFullPostC, raw, 'GatewayFullPost');
    }
    async getPostsForProfile(slug, options) {
        const raw = await this.client.get(`/profiles/${encodeURIComponent(slug)}/posts`, {
            limit: options.limit,
            offset: options.offset
        });
        const page = decodeOrThrow(GatewayPostsPageC, raw, 'GatewayPostsPage');
        return page.items;
    }
}

class NoteService {
    constructor(client) {
        this.client = client;
    }
    async getNoteById(id) {
        const raw = await this.client.get(`/notes/${id}`);
        return decodeOrThrow(GatewayNoteC, raw, 'GatewayNote');
    }
    async getNotesForLoggedUser(options) {
        const params = {};
        if (options === null || options === void 0 ? void 0 : options.cursor)
            params.cursor = options.cursor;
        const raw = await this.client.get('/me/notes', params);
        const page = decodeOrThrow(GatewayNotesPageC, raw, 'GatewayNotesPage');
        return { notes: page.items, nextCursor: page.next_cursor };
    }
    async getNotesForProfile(slug, options) {
        const params = {};
        if (options === null || options === void 0 ? void 0 : options.cursor)
            params.cursor = options.cursor;
        const raw = await this.client.get(`/profiles/${encodeURIComponent(slug)}/notes`, params);
        const page = decodeOrThrow(GatewayNotesPageC, raw, 'GatewayNotesPage');
        return { notes: page.items, nextCursor: page.next_cursor };
    }
}

class ProfileService {
    constructor(client) {
        this.client = client;
    }
    async getOwnProfile() {
        const raw = await this.client.get('/me');
        return decodeOrThrow(GatewayProfileC, raw, 'GatewayProfile');
    }
    async getProfileBySlug(slug) {
        const raw = await this.client.get(`/profiles/${encodeURIComponent(slug)}`);
        return decodeOrThrow(GatewayProfileC, raw, 'GatewayProfile');
    }
}

class CommentService {
    constructor(client) {
        this.client = client;
    }
    async getCommentsForPost(postId) {
        const raw = await this.client.get(`/posts/${postId}/comments`);
        const response = decodeOrThrow(GatewayCommentsResponseC, raw, 'GatewayCommentsResponse');
        return response.items;
    }
}

class FollowingService {
    constructor(client) {
        this.client = client;
    }
    async getFollowing() {
        const raw = await this.client.get('/me/following');
        const response = decodeOrThrow(GatewayFollowingResponseC, raw, 'GatewayFollowingResponse');
        return response.items;
    }
}

class ConnectivityService {
    constructor(client) {
        this.client = client;
    }
    async isConnected() {
        try {
            await this.client.get('/health/ready');
            return true;
        }
        catch (_a) {
            return false;
        }
    }
}

class NewNoteService {
    constructor(client) {
        this.client = client;
    }
    async publishNote(content, attachment) {
        const body = { content };
        if (attachment)
            body.attachment = attachment;
        const raw = await this.client.post('/notes', body);
        return decodeOrThrow(GatewayCreateNoteResponseC, raw, 'GatewayCreateNoteResponse');
    }
}

class SubstackClient {
    constructor(config) {
        var _a;
        const gatewayBase = ((_a = config.gatewayUrl) !== null && _a !== void 0 ? _a : 'https://substack-gateway.vercel.app').replace(/\/$/, '');
        const baseUrl = `${gatewayBase}/api/v1`;
        this.perPage = config.perPage || 25;
        const maxRequestsPerSecond = config.maxRequestsPerSecond || 25;
        this.client = new HttpClient(baseUrl, { token: config.token, publicationUrl: config.publicationUrl }, maxRequestsPerSecond);
        this.postService = new PostService(this.client);
        this.noteService = new NoteService(this.client);
        this.profileService = new ProfileService(this.client);
        this.commentService = new CommentService(this.client);
        this.followingService = new FollowingService(this.client);
        this.connectivityService = new ConnectivityService(this.client);
        this.newNoteService = new NewNoteService(this.client);
    }
    async testConnectivity() {
        return this.connectivityService.isConnected();
    }
    async ownProfile() {
        try {
            const profile = await this.profileService.getOwnProfile();
            return new OwnProfile(profile, this.postService, this.noteService, this.commentService, this.profileService, this.followingService, this.newNoteService, this.perPage);
        }
        catch (error) {
            throw new Error(`Failed to get own profile: ${error.message}`);
        }
    }
    async profileForSlug(slug) {
        if (!slug || slug.trim() === '') {
            throw new Error('Profile slug cannot be empty');
        }
        try {
            const profile = await this.profileService.getProfileBySlug(slug);
            return new Profile(profile, this.postService, this.noteService, this.commentService, this.perPage);
        }
        catch (error) {
            throw new Error(`Profile with slug '${slug}' not found: ${error.message}`);
        }
    }
    async postForId(id) {
        try {
            const post = await this.postService.getPostById(id);
            return new FullPost(post, this.commentService);
        }
        catch (error) {
            throw new Error(`Post with ID ${id} not found: ${error.message}`);
        }
    }
    async noteForId(id) {
        try {
            const noteData = await this.noteService.getNoteById(id);
            return new Note(noteData);
        }
        catch (_a) {
            throw new Error(`Note with ID ${id} not found`);
        }
    }
}

exports.Comment = Comment;
exports.FullPost = FullPost;
exports.Note = Note;
exports.OwnProfile = OwnProfile;
exports.PreviewPost = PreviewPost;
exports.Profile = Profile;
exports.SubstackClient = SubstackClient;
