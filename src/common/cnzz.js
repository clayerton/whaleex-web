export function addCnzzListener() {
  const webId = _config.cnzz_webid;
  var cnzz_s_tag = document.createElement('script');
  cnzz_s_tag.type = 'text/javascript';
  cnzz_s_tag.async = true;
  cnzz_s_tag.charset = 'utf-8';
  cnzz_s_tag.src = `https://s19.cnzz.com/z_stat.php?id=${webId}&web_id=${webId}&async=1`;
  var root_s = document.getElementsByTagName('script')[0];
  root_s.parentNode.insertBefore(cnzz_s_tag, root_s);
}
