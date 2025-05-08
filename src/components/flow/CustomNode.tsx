import { Handle, Position, useConnection } from '@xyflow/react';
import { useState } from 'react';

export default function CustomNode({ id, data }) {
  const connection = useConnection();
  const [isHovered, setIsHovered] = useState(false);
  
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  const isWarehouse = data.type === 'warehouse';
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className={`customNode ${isWarehouse ? 'warehouse' : 'storefront'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="customNodeBody">
        {!connection.inProgress && (
          <Handle
            className="customHandle"
            position={Position.Right}
            type="source"
          />
        )}
        {(!connection.inProgress || isTarget) && (
          <Handle 
            className="customHandle" 
            position={Position.Left} 
            type="target" 
            isConnectableStart={false} 
          />
        )}
        
        <div className="nodeContent">
          {isWarehouse ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="node-icon">
                <path d="M12 2L2 7v15h20V7L12 2zm0 2.5L18 8v1h-2v4h-4V9h-4V8l6-3.5zM6 14h2v7H6v-7zm4 0h4v7h-4v-7zm6 0h2v7h-2v-7z"/>
              </svg>
              <div className="label">{data.label}</div>
              {data.isDefault && <div className="default-badge">DEFAULT</div>}
              {isHovered && data.cities && (
                <div className="cities-tooltip">
                  <span>Cities: {data.cities}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="node-icon">
                <path d="M20 4H4v2h16V4zm1 8v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
              </svg>
              <div className="label">{data.label}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}