const CHANGE_SEARCH_CONTENT = 'frontEnd/CHANGE_SEARCH_CONTENT';
const GET_COMMODITIES_DETAIL = 'frontEnd/GET_COMMODITIES_DETAIL';

const initialState = {
  searchContent: '', // 搜索内容
  commoditiesDetail: {}, // 购买数量
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_SEARCH_CONTENT:
      return {
        ...state,
        searchContent: action.payload,
      };
    case GET_COMMODITIES_DETAIL:
      return {
        ...state,
        commoditiesDetail: action.payload,
      };
    default:
      return state;
  }
}

export function changeSearchContent(searchContent) {
  return (dispatch) => {
    dispatch({
      type: CHANGE_SEARCH_CONTENT,
      payload: searchContent,
    });
  };
}

export function getCommoditiesDetail(commoditiesDetail) {
  return (dispatch) => {
    dispatch({
      type: GET_COMMODITIES_DETAIL,
      payload: commoditiesDetail,
    });
  };
}

