import edit from './edit.png';
import React from 'react';
import {useDispatch} from 'react-redux';
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {ItemsActionType as at} from '../../store/typeStore/typesServices'
import {useEffectOnce} from "../../hooks/useEffectOnce";
import {useNavigate} from 'react-router-dom';

function ServiceList() {
  const dispatch = useDispatch();
  const {items} = useTypedSelector((state) => state.items);
  const loading = useTypedSelector((state) => state.items.loading);
  const error = useTypedSelector((state) => state.items.error);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch({type: at.FETCH_ITEMS});
      const res = await fetch(`${process.env.REACT_APP_URL}/api/services`);
      if (!res.ok) {
        dispatch({type: at.FETCH_ITEMS_ERROR, payload: res.statusText});
        return;
      }
      const data = await res.json();
      dispatch({type: at.FETCH_ITEMS_SUCCESS, payload: data});
    } catch (e) {
      const result = (e as Error).message;
      dispatch({type: at.FETCH_ITEMS_ERROR, payload: result});
    }
  }

  useEffectOnce(() => {
    try {
      getData().then(() => {
      });
    } catch (e) {
      const result = (e as Error).message;
      dispatch({type: at.FETCH_ITEMS_ERROR, payload: result});
    }
  });

  if (loading) {
    return (
      <div className={"loading-wrapper"}>Loading....
        <div className={"loader"}/>
      </div>
    )
  }

  if (error) {
    return (
      <div className={"error-wrapper"}>
        <p className={"error"}>Что-то пошло не так. Обновите страницу </p>
      </div>
    )
  }

  const [first] = items;

  if (first.name === null) {
    return (<></>);
  }

  const handleEdit = ((id: number | null) => {
    if (id !== null) {
      dispatch({type: at.EDIT_ITEM, payload: id});
      navigate(`/ra-thunk-api-redux-front/services/${id}`);
    } else {
      return;
    }
  })

  const handleRemove = (id: number) => {
    const params = new FormData();
    params.set('id', id.toString());

    dispatch({type: at.FETCH_ITEMS});

    try {
      const result = fetch(`${process.env.REACT_APP_URL}/api/services/${id}`, {
        method: 'DELETE',
        body: params
      });
      result.then((data) => {
          if (!data.ok) {
            dispatch({type: at.FETCH_ITEMS_ERROR, payload: result});
            return;
          } else {
            getData().then(() => {
            });
          }
        }
      ).catch((e) => {
        const result = (e as Error).message;
        dispatch({type: at.FETCH_ITEMS_ERROR, payload: result});
      });
    } catch (e) {
      const result = (e as Error).message;
      dispatch({type: at.FETCH_ITEMS_ERROR, payload: result});
    }
  }

  return (
    <div className="container">
      <ul className={"list list-items"}>
        {items.map(item => {
          return (
            <li className={"list-item"} key={item.id}>
              <div className={"service-name"}>{item.name}</div>
              <div className={"service-price"}>{item.price}</div>
              <div className={"service-btn"}>
                <button className={"btn btn-edit"} onClick={(e) => handleEdit(item.id)}><img className={"img-edit"}
                                                                                             src={edit}
                                                                                             alt={"иконка редактирования услуги"}/>
                </button>
                <button className={"btn"} onClick={(e) => handleRemove(item.id)}>X</button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ServiceList;
