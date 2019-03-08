const CHANGE_SEARCH_DETAIL = 'frontEnd/CHANGE_SEARCH_DETAIL';
const GET_GOODS_TYPE = 'frontEnd/GET_GOODS_TYPE';

const initialState = {
  searchContent: '', // 搜索内容
  id: null, // 选中的商品类型
  typeName: null, // 选种类型
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_SEARCH_DETAIL:
      return {
        ...state,
        searchContent: action.payload.searchContent,
        id: action.payload.id,
        typeName: action.payload.typeName
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
