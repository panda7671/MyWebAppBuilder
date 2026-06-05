import { UIComponent } from '@/types'
import MobileFrame from './MobileFrame'
import {
  HeaderBlock,
  NavBlock,
  ListBlock,
  CardBlock,
  FormBlock,
  ButtonBlock,
  TextBlock,
  ImagePlaceholderBlock,
} from './blocks'

interface WireframeRendererProps {
  components: UIComponent[]
  navTabs?: string[]
  activeTab?: string
}

export default function WireframeRenderer({
  components,
  navTabs,
  activeTab,
}: WireframeRendererProps) {
  const navComponent = components.find((c) => c.type === 'nav')
  const bodyComponents = components.filter((c) => c.type !== 'nav')

  return (
    <MobileFrame
      footer={
        navComponent ? (
          <NavBlock label={navComponent.label} tabs={navTabs} activeTab={activeTab} />
        ) : undefined
      }
    >
      {bodyComponents.map((c, i) => {
        switch (c.type) {
          case 'header':
            return <HeaderBlock key={i} label={c.label} />
          case 'list':
            return <ListBlock key={i} label={c.label} />
          case 'card':
            return <CardBlock key={i} label={c.label} />
          case 'form':
            return <FormBlock key={i} label={c.label} />
          case 'button':
            return <ButtonBlock key={i} label={c.label} />
          case 'text':
            return <TextBlock key={i} label={c.label} />
          case 'image-placeholder':
            return <ImagePlaceholderBlock key={i} label={c.label} />
          default:
            return null
        }
      })}
    </MobileFrame>
  )
}
