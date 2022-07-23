import React from 'react';
import {useDispatch} from 'react-redux';
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {useEffectOnce} from "../../hooks/useEffectOnce";
import {ItemsActionType as at} from '../../store/typeStore/typesUpdate'
import {Link, NavLink, Navigate, useNavigate} from 'react-router-dom';

function ServiceUpdate() {
  const dispatch = useDispatch();
  const name = useTypedSelector((state) => state.itemUpdate.nameValue);
  const price = useTypedSelector((state) => state.itemUpdate.priceValue);
  const desc = useTypedSelector((state) => state.itemUpdate.descValue);
  const itemId = useTypedSelector((state) => state.items.editId);
  const loading = useTypedSelector((state) => state.itemUpdate.loading);
  const error = useTypedSelector((state) => state.itemUpdate.error);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch({type: at.FETCH_UPDATE_REQUEST});
      const res = await fetch(`${process.env.REACT_APP_URL}/api/services/${itemId}`);
      if (!res.ok) {
        dispatch({type: at.FETCH_UPDATE_ERROR, payload: res.statusText});
      }
      const data = await res.json();
      dispatch({type: at.FETCH_UPDATE_SUCCESS, payload: data});
      dispatch({type: at.CHANGE_NAME_VALUE, payload: data.name});
      dispatch({type: at.CHANGE_PRICE_VALUE, payload: data.price});
      dispatch({type: at.CHANGE_DESC_VALUE, payload: data.content});
    } catch (e) {
      const result = (e as Error).message;
      dispatch({type: at.FETCH_UPDATE_ERROR, payload: result});
    }
  }

  useEffectOnce(() => {
    try {
      getData().then(() => {
      });
    } catch (e) {
      const result = (e as Error).message;
      dispatch({type: at.FETCH_UPDATE_ERROR, payload: result});
    }
  });

  if (itemId === 0) {
    return (<Navigate to={`/ra-thunk-api-redux-front`}/>)
  }

  if (loading) {
    return (
      <div className={"loading-wrapper"}>Loading....
        <div className={"loader"}/>
      </div>
    )
  }

  if (error) {
    return (
      <>
        <div className={"error-wrapper"}>
          <p className={"error"}>Что-то пошло не так.</p>
          <Link to={"/ra-thunk-api-redux-front"} className={"error-link"}>Вернуться к списку</Link>
        </div>
      </>
    )
  }

  const handleName = (event: { target: { name: string; value: string; }; }) => {
    dispatch({type: at.CHANGE_NAME_VALUE, payload: event.target.value});
  }

  const handlePrice = (event: { target: { name: string; value: string; }; }) => {
    dispatch({type: at.CHANGE_PRICE_VALUE, payload: event.target.value});
  }

  const handleDesc = (event: { target: { name: string; value: string; }; }) => {
    dispatch({type: at.CHANGE_DESC_VALUE, payload: event.target.value});
  }

  const handleSubmit = (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    dispatch({type: at.FETCH_UPDATE_REQUEST});
    const form = document.querySelector('#form');

    if (form instanceof HTMLFormElement) {
      const params = new FormData(form);
      params.set('id', itemId.toString());

      const paramsData = Array.from(params.entries()).reduce((obj, prop) => ({
        ...obj,
        [prop[0]]: prop[1],
      }), {});

      dispatch(dispatch({type: at.FETCH_UPDATE_REQUEST}));

      try {
        const result = fetch(`${process.env.REACT_APP_URL}/api/services`, {
          method: 'POST',
          body: JSON.stringify(paramsData)
        });
        dispatch(dispatch({type: at.FETCH_UPDATE_REQUEST}));

        result.then((data) => {
            if (!data.ok) {
              dispatch({type: at.FETCH_UPDATE_ERROR, payload: data.statusText});
            } else {
              dispatch({type: at.FETCH_UPDATE_REQUEST});
              navigate('/ra-thunk-api-redux-front');
            }
          }
        ).catch((e) => {
          const result = (e as Error).message;
          dispatch({type: at.FETCH_UPDATE_ERROR, payload: result});
        })
      } catch (e) {
        const result = (e as Error).message;
        dispatch({type: at.FETCH_UPDATE_ERROR, payload: result});
      }
    }
  }

  return (
    <div className="container">
      <div className="container-services">
        <div className={"content-container"}>
          <form className={"form"} id={"form"} onSubmit={handleSubmit}>
            <div>
              <label className={"form-row"}>
                <span className={"name-field"}>Наименование услуги</span>
                <input className={"field"} name="name" value={name} onChange={handleName} required/>
              </label>
            </div>

            <div>
              <label className={"form-row"}>
                <span className={"name-field"}>Стоимость услуги</span>
                <input className={"field"} name="price" value={price} onChange={handlePrice} required/>
              </label>
            </div>

            <div>
              <label className={"form-row"}>
                <span className={"name-field"}>Описание услуги</span>
                <input className={"field"} name="content" value={desc} onChange={handleDesc} required/>
              </label>
            </div>

            <div className={"form-row form-row-button"}>
              <button type="submit" className={"btn-control"}>Save</button>
              <NavLink to={"/ra-thunk-api-redux-front"}>
                <button className={"btn-control"}>Cancel</button>
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ServiceUpdate;
