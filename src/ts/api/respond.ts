export function respond(status: number, body: any): Response | PromiseLike<Response> {
    return new Response(
        JSON.stringify(body),
        {
            headers: { "Content-Type": "application/json" },
            status
        }
    );
}