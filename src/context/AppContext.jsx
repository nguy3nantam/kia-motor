import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { cars as defaultCars } from '../data/cars'
import { site as defaultSite } from '../data/site'
import { defaultSlides } from '../data/slides'
import { adminConfig } from '../data/admin'
import {
  loadCars,
  loadLeads,
  loadSite,
  loadSlides,
  loadUsers,
  normalizeLead,
  removeStored,
  saveLead,
  STORAGE_KEYS,
  writeJSON,
} from '../lib/store'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Modal đăng ký báo giá / lái thử
  const [lead, setLead] = useState({ open: false, carId: null, intent: 'bao-gia' })

  // Modal chi tiết xe
  const [detailId, setDetailId] = useState(null)

  const [cars, setCarsState] = useState(() => loadCars(defaultCars))
  const [site, setSiteState] = useState(() => loadSite(defaultSite))
  const [leads, setLeadsState] = useState(() => loadLeads())
  const [slides, setSlidesState] = useState(() => loadSlides(defaultSlides))
  const [users, setUsersState] = useState(() => loadUsers(adminConfig.password))

  useEffect(() => {
    const syncStorage = (event) => {
      if (event.key === STORAGE_KEYS.cars) setCarsState(loadCars(defaultCars))
      if (event.key === STORAGE_KEYS.site) setSiteState(loadSite(defaultSite))
      if (event.key === STORAGE_KEYS.leads) setLeadsState(loadLeads())
      if (event.key === STORAGE_KEYS.slides) setSlidesState(loadSlides(defaultSlides))
      if (event.key === STORAGE_KEYS.users) setUsersState(loadUsers(adminConfig.password))
    }
    window.addEventListener('storage', syncStorage)
    return () => window.removeEventListener('storage', syncStorage)
  }, [])

  const openLead = useCallback((carId = null, intent = 'bao-gia') => {
    setLead({ open: true, carId, intent })
  }, [])

  const closeLead = useCallback(
    () => setLead((prev) => ({ ...prev, open: false })),
    [],
  )

  const openDetail = useCallback((id) => setDetailId(id), [])
  const closeDetail = useCallback(() => setDetailId(null), [])

  const setCars = useCallback((next) => {
    if (!Array.isArray(next) || next.length === 0) return false
    setCarsState(next)
    return writeJSON(STORAGE_KEYS.cars, next)
  }, [])

  const resetCars = useCallback(() => {
    removeStored(STORAGE_KEYS.cars)
    setCarsState(defaultCars)
  }, [])

  const setSite = useCallback((next) => {
    const merged = { ...next, nav: defaultSite.nav }
    setSiteState(merged)
    return writeJSON(STORAGE_KEYS.site, merged)
  }, [])

  const resetSite = useCallback(() => {
    removeStored(STORAGE_KEYS.site)
    setSiteState(defaultSite)
  }, [])

  const setSlides = useCallback((next) => {
    if (!Array.isArray(next) || next.length === 0) return false
    setSlidesState(next)
    return writeJSON(STORAGE_KEYS.slides, next)
  }, [])

  const resetSlides = useCallback(() => {
    removeStored(STORAGE_KEYS.slides)
    setSlidesState(defaultSlides)
  }, [])

  const setUsers = useCallback((next) => {
    const valid = Array.isArray(next) && next.length > 0 &&
      next.some((user) => user.role === 'admin' && user.active)
    if (!valid) return false
    setUsersState(next)
    return writeJSON(STORAGE_KEYS.users, next)
  }, [])

  const resetUsers = useCallback(() => {
    removeStored(STORAGE_KEYS.users)
    removeStored(STORAGE_KEYS.password)
    setUsersState(loadUsers(adminConfig.password))
  }, [])

  const addLead = useCallback((entry) => {
    const next = saveLead(entry)
    if (!next) return null
    setLeadsState(next)
    return next[0]
  }, [])

  const updateLead = useCallback((id, patch) => {
    const next = loadLeads().map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    )
    writeJSON(STORAGE_KEYS.leads, next)
    setLeadsState(next)
  }, [])

  const removeLead = useCallback((id) => {
    const next = loadLeads().filter((item) => item.id !== id)
    writeJSON(STORAGE_KEYS.leads, next)
    setLeadsState(next)
  }, [])

  const clearLeads = useCallback(() => {
    removeStored(STORAGE_KEYS.leads)
    setLeadsState([])
  }, [])

  const replaceLeads = useCallback((items) => {
    const next = Array.isArray(items) ? items.map(normalizeLead).slice(0, 500) : []
    writeJSON(STORAGE_KEYS.leads, next)
    setLeadsState(next)
  }, [])

  const value = useMemo(
    () => ({
      lead,
      openLead,
      closeLead,
      detailId,
      openDetail,
      closeDetail,
      cars,
      setCars,
      resetCars,
      site,
      setSite,
      resetSite,
      leads,
      addLead,
      updateLead,
      removeLead,
      clearLeads,
      replaceLeads,
      slides,
      setSlides,
      resetSlides,
      users,
      setUsers,
      resetUsers,
    }),
    [
      lead,
      openLead,
      closeLead,
      detailId,
      openDetail,
      closeDetail,
      cars,
      setCars,
      resetCars,
      site,
      setSite,
      resetSite,
      leads,
      addLead,
      updateLead,
      removeLead,
      clearLeads,
      replaceLeads,
      slides,
      setSlides,
      resetSlides,
      users,
      setUsers,
      resetUsers,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp phải được dùng bên trong <AppProvider>')
  return ctx
}
