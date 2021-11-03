export default ({ res }, url) => {
  res.setHeader("Location", encodeURI(url));
  res.statusCode = 302;
  res.end();
}
