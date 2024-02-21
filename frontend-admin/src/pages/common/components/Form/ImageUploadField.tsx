import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { SetValueConfig, UseFormRegisterReturn } from "react-hook-form";
import { clsx as cx } from "clsx";
import { twMerge } from "tailwind-merge";

export function ImageUploadField2(props: {
  label?: string;
  image: FileList | null | undefined;
  register: UseFormRegisterReturn;
  setImage: (i: null, o: SetValueConfig) => void;
  className?: string;
  imageClassName?: string;
  currentImageUrl: string | null;
  dirty: boolean;
}) {
  const {
    className,
    imageClassName,
    image,
    setImage,
    currentImageUrl,
    dirty,
    register: { ref, ...imageRegister },
  } = props;
  const imgUploadRef = useRef<ImageUploadRef | null>(null);

  return (
    <div className={className}>
      {props.label && <label>{props.label}</label>}
      <div className="mt-1 flex">
        <ImageUpload2
          {...imageRegister}
          imageClassName={imageClassName}
          ref={(e) => {
            if (e) {
              const imgInputRef = e.imgInput();
              if (imgInputRef) {
                ref(imgInputRef);
              }
            }
            imgUploadRef.current = e;
          }}
          currentImageUrl={currentImageUrl ? currentImageUrl : undefined}
        />

        {((image && image.length > 0) ||
          (currentImageUrl !== null && !dirty)) && (
          <div className="flex w-[92px] items-end justify-end">
            <button
              type="button"
              onClick={(e) => {
                imgUploadRef.current?.removeImage();
                setImage(null, { shouldDirty: true });
              }}
              className="w-[80px] rounded-md border border-red-500 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white"
            >
              DELETE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ImageUploadField(props: {
  label?: string;
  image: FileList | null | undefined;
  register: UseFormRegisterReturn;
  onDeleteImage: () => void;
  className?: string;
  imageClassName?: string;
}) {
  const {
    className,
    imageClassName,
    register: { ref, ...imageRegister },
  } = props;
  const imgUploadRef = useRef<ImageUploadRef | null>(null);

  return (
    <div className={className}>
      {props.label && <label>{props.label}</label>}
      <div className="mt-1 flex">
        <ImageUpload
          {...imageRegister}
          imageClassName={imageClassName}
          ref={(e) => {
            if (e) {
              const imgInputRef = e.imgInput();
              if (imgInputRef) {
                ref(imgInputRef);
              }
            }
            imgUploadRef.current = e;
          }}
        />

        {props.image && props.image.length > 0 && (
          <div className="flex w-[92px] items-end justify-end">
            <button
              type="button"
              onClick={(e) => {
                imgUploadRef.current?.removeImage();
                props.onDeleteImage();
              }}
              className="w-[80px] rounded-md border border-red-500 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white"
            >
              DELETE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type ImageUploadRef = {
  imgInput: () => HTMLInputElement | null;
  removeImage: () => void;
};

const ImageUpload = forwardRef<
  ImageUploadRef,
  {
    name: string;
    onInput?: React.FormEventHandler<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    imageClassName?: string;
  }
>((props, ref) => {
  const img = useRef<HTMLImageElement | null>(null);
  const imgInput = useRef<HTMLInputElement | null>(null);

  const [showImage, setShowImage] = useState(false);

  const loadFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && img.current) {
      img.current.src = URL.createObjectURL(files[0]);
      setShowImage(true);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  useImperativeHandle(ref, (): ImageUploadRef => {
    return {
      imgInput: () => {
        return imgInput.current;
      },
      removeImage: () => {
        if (img.current) {
          img.current.src = "";
          setShowImage(false);
        }
        if (imgInput.current) {
          imgInput.current.files = null;
        }
      },
    };
  });

  return (
    <div>
      <div
        className={twMerge(
          "relative flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-gray-400 bg-white text-center",
          props.imageClassName,
        )}
      >
        <p className={cx("text-xs text-gray-400", { hidden: showImage })}>
          384x384
        </p>
        <img
          ref={img}
          className={cx("h-full w-full rounded-lg object-cover", {
            hidden: !showImage,
          })}
        />
        <label
          htmlFor={props.name}
          className="image-upload border-1 absolute -bottom-2 right-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-50  shadow-[0_2px_6px_0_rgba(0,0,0,0.3)] hover:bg-blue-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            className="icon h-5 w-5"
          >
            <path d="M11.47 1.72a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 01-1.06-1.06l3-3zM11.25 7.5V15a.75.75 0 001.5 0V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
          </svg>
        </label>
        <input
          ref={imgInput}
          name={props.name}
          type="file"
          id={props.name}
          className="hidden"
          accept="image/*"
          onInput={props.onInput}
          onChange={loadFile}
          onBlur={props.onBlur}
        />
      </div>
    </div>
  );
});

const ImageUpload2 = forwardRef<
  ImageUploadRef,
  {
    name: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    imageClassName?: string;
    currentImageUrl?: string;
  }
>((props, ref) => {
  const img = useRef<HTMLImageElement | null>(null);
  const imgInput = useRef<HTMLInputElement | null>(null);

  const [showImage, setShowImage] = useState(
    props.currentImageUrl ? true : false,
  );

  const loadFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && img.current) {
      img.current.src = URL.createObjectURL(files[0]);
      setShowImage(true);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  useImperativeHandle(ref, (): ImageUploadRef => {
    return {
      imgInput: () => {
        return imgInput.current;
      },
      removeImage: () => {
        if (img.current) {
          img.current.src = "";
          setShowImage(false);
        }
        if (imgInput.current) {
          imgInput.current.files = null;
        }
      },
    };
  });

  return (
    <div>
      <div
        className={twMerge(
          "relative flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-gray-400 bg-white text-center",
          props.imageClassName,
        )}
      >
        <p className={cx("text-xs text-gray-400", { hidden: showImage })}>
          384x384
        </p>
        <img
          ref={img}
          className={cx("h-full w-full rounded-lg object-cover", {
            hidden: !showImage,
          })}
          src={props.currentImageUrl}
        />
        <label
          htmlFor={props.name}
          className="image-upload border-1 absolute -bottom-2 right-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-50  shadow-[0_2px_6px_0_rgba(0,0,0,0.3)] hover:bg-blue-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            className="icon h-5 w-5"
          >
            <path d="M11.47 1.72a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 01-1.06-1.06l3-3zM11.25 7.5V15a.75.75 0 001.5 0V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
          </svg>
        </label>
        <input
          ref={imgInput}
          name={props.name}
          type="file"
          id={props.name}
          className="hidden"
          accept="image/*"
          onChange={loadFile}
          onBlur={props.onBlur}
        />
      </div>
    </div>
  );
});
