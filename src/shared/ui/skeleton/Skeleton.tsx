import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: number | string
  height?: number | string
  radius?: number
}

export function Skeleton({ width = '100%', height = 20, radius }: SkeletonProps) {
  return <span className={styles.skeleton} style={{ width, height, borderRadius: radius }} aria-hidden="true" />
}
