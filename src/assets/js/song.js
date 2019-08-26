
export default class Song {
  constructor({id, singer, name, album, sid, image, aid}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.sid = sid
    this.image = image
    this.aid = aid
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.id,
    singer: filterSinger(musicData.ar),
    name: musicData.name,
    album: musicData.al.name,
    sid: musicData.ar,
    image: musicData.al.picUrl,
    aid: musicData.al.id
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
