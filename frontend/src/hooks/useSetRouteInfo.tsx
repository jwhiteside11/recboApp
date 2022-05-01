import React, { useEffect, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAppDispatch } from '../redux/hooks'
import { changeRouteStateNoHistory, setQueryParams, setRouteAndTitle } from '../redux/routes/routeSlice'
import { User } from '../types'
import useMapRouteToTitle from './useMapRouteToTitle'
import useQueryParams from './useQueryParams'

const useSetRouteInfo = (user: User) => {
  const history = useHistory()
  const dispatch = useAppDispatch()
  const mapRouteToTitle = useMapRouteToTitle()
  const queryParams = useQueryParams()

  const handleRouteChange = useCallback(() => {
    let path = history.location.pathname
    console.log("PATH CHANGED TO", path)
    console.log("QPS")

    let qPArray: string[][] = []
    queryParams.forEach((v, k) => { qPArray.push([k, v]); console.log("QUERY PARAM", k, v)})

    dispatch(setQueryParams(qPArray))
    dispatch(setRouteAndTitle([path, mapRouteToTitle(path, user.username)]))
  }, [dispatch, history.location.pathname, mapRouteToTitle, queryParams, user.username])

  // On mount, load subcomponent according to url
  useEffect(() => {
    handleRouteChange()
  }, [handleRouteChange])

  useEffect(() => {
    window.addEventListener('popstate', handleRouteChange)
    
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [handleRouteChange])
}

export default useSetRouteInfo;