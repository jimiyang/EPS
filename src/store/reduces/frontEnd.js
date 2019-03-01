const CHANGE_SEARCH_CONTENT = 'frontEnd/CHANGE_SEARCH_CONTENT';
const GET_COMMODITIES_TYPE = 'frontEnd/GET_COMMODITIES_TYPE';

const initialState = {
  searchContent: '', // 搜索内容
  id: null, // 选中的商品类型
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_SEARCH_CONTENT:
      return {
        ...state,
        searchContent: action.payload.searchContent,
        id: action.payload.id,
      };
    default:
      return state;
  }
}

export function changeSearchContent(content) {
  return (dispatch) => {
    dispatch({
      type: CHANGE_SEARCH_CONTENT,
      payload: content,
    });
  };
}
