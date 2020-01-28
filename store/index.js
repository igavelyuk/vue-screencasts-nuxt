export const state = () => ({
  videos: [],
  tags: [],
  isLoaded: false,
})

export const mutations = {
  SET_VIDEOS (state, videos) {
    state.videos = videos
  },
  SET_TAGS (state, tags) {
    state.tags = tags
  },
  FINISH_LOADING(state) {
    state.isLoaded = true;
  }
}

export const actions = {
  async loadAllVideos({commit}) {
    let {data: videos} = await getData('/videos', this.$axios)
    deserializeVideos(videos)
    commit('SET_VIDEOS', videos.map(v => v.attributes))
  },
  async loadAllTags({commit}) {
    let {data: tags} = await getData('/tags', this.$axios)
    deserializeTags(tags)
    commit('SET_TAGS', tags.map(t => t.attributes))
  },
}

const deserializeTags = function(tags) {
  tags.forEach(t => {
    t.attributes.id = t.id;
    t.attributes.video_ids = t.relationships.videos.data.map(v => v.id)
  })
}

const deserializeVideos = function(videos) {
  videos.forEach(v => {
    v.attributes.tag_ids = v.relationships.tags.data.map(t => t.id);
    v.attributes.id = v.id;
  });
}

const getData = async function(url, axios) {
  let response = await axios.get(url)
  return {
    data: response.data.data,
    included: response.data.included
  }
}