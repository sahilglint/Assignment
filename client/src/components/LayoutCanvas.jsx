import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reorderBlocks } from '../redux/layoutSlice';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  rectSortingStrategy
} from '@dnd-kit/sortable';

import HeroBlock from './blocks/HeroBlock';
import TwoColumnRow from './blocks/TwoColumnRow';
import ImageGrid from './blocks/ImageGrid';
import SortableBlock from './SortableBlock';

const LayoutCanvas = () => {
  const layout = useSelector(s => s.layout.present.blocks);
  const dispatch = useDispatch();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = layout.findIndex(b => b.id === active.id);
      const newIndex = layout.findIndex(b => b.id === over.id);
      const newBlocks = arrayMove(layout, oldIndex, newIndex);
      dispatch(reorderBlocks(newBlocks));
    }
  };

  const renderBlock = block => {
    const props = { key: block.id, id: block.id, data: block.data };
    switch (block.type) {
      case 'hero':
        return <SortableBlock {...props}><HeroBlock {...block.data} /></SortableBlock>;
      case 'twoColumn':
        return <SortableBlock {...props}><TwoColumnRow {...block.data} /></SortableBlock>;
      case 'imageGrid':
        return <SortableBlock {...props}><ImageGrid {...block.data} /></SortableBlock>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={layout.map(b => b.id)} strategy={rectSortingStrategy}>
          <div className="space-y-6">{layout.map(renderBlock)}</div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default LayoutCanvas;
