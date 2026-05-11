export function getHealth(_request, response) {
  response.json({
    status: "ok",
    service: "dress-server"
  });
}
