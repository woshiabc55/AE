import React from 'react';

export interface IconToolbarProps {
  icons?: Array<{ id: string; label: string; icon: string }>;
  orientation?: 'horizontal' | 'vertical';
  size?: number;
}

const IconToolbar: React.FC<IconToolbarProps> = ({
  icons = [
    { id: 'select', label: '选择', icon: '◇' },
    { id: 'move', label: '移动', icon: '✥' },
    { id: 'zoom', label: '缩放', icon: '⊕' },
    { id: 'rotate', label: '旋转', icon: '↻' },
    { id: 'measure', label: '测量', icon: '⌗' },
  ],
  orientation = 'horizontal',
  size = 28,
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={`inline-flex bg-white border border-ink ${isHorizontal ? 'flex-row' : 'flex-col'}`}
      style={{ borderRadius: '2px' }}
    >
      {icons.map((item, i) => (
        <button
          key={item.id}
          className="flex items-center justify-center border-[#e0e0e0] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          style={{
            width: size,
            height: size,
            fontSize: size * 0.4,
            borderRight: isHorizontal && i < icons.length - 1 ? '1px solid #e0e0e0' : 'none',
            borderBottom: !isHorizontal && i < icons.length - 1 ? '1px solid #e0e0e0' : 'none',
          }}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default IconToolbar;
