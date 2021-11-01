import imgur from 'imgur';

export async function uploadImage(message) {
  const anexo = message.attachments.find((anex) => anex.url);
  console.log(anexo.url);
  let urlUpload;
  imgur.setClientId('548e6d2d5249c7f');
  imgur.getClientId();
  await imgur
    .uploadUrl(anexo.url)
    .then((json) => {
      urlUpload = json.link;
    })
    .catch();

  return urlUpload;
}
