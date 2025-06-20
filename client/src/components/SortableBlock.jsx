import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableBlock = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded shadow">
      <div {...attributes} {...listeners} className="cursor-move p-2 bg-gray-100 rounded-t">
        Drag
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default SortableBlock;
