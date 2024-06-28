import React from "react";

interface LinkToolData {
  link: string;
  meta: {
    title: string;
    site_name: string;
    description: string;
    image: {
      url: string;
    };
  };
}

const LinkToolRenderer: React.FC<{ data: LinkToolData }> = ({ data }) => {
  return (
    <div className="link-tool border rounded-lg p-4 hover:bg-gray-100 transition shadow-md">
      <a
        href={data.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center"
      >
        <div className="flex-1 min-w-0">
          {" "}
          <h4 className="font-semibold text-lg overflow-hidden text-ellipsis whitespace-nowrap">
            {data.meta.title}
          </h4>
          <p className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
            {data.meta.description}
          </p>
          <span className="text-gray-400 text-sm">{data.meta.site_name}</span>
        </div>
        <div className="ml-4 flex-shrink-0 w-28 h-28 overflow-hidden rounded-lg">
          {data.meta.image && (
            <img
              src={data.meta.image.url}
              alt={data.meta.title}
              className="object-cover w-full h-full"
            />
          )}
        </div>
      </a>
    </div>
  );
};

export default LinkToolRenderer;
