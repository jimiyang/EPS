const CHANGE_SEARCH_DETAIL = 'frontEnd/CHANGE_SEARCH_DETAIL';

const initialState = {
  type: null, // 查询类型
  searchContent: '', // 搜索内容
  id: null, // 属性或类型
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_SEARCH_DETAIL:
      return {
        ...state,
        type: action.payload.type,
        id: action.payload.id,
        searchContent: action.payload.searchContent,
      };
    default:
      return state;
  }
}

export function changeSearchDetail(content = {}) {
  return (dispatch) => {
    dispatch({
      type: CHANGE_SEARCH_DETAIL,
      payload: content,
    });
  };
}
