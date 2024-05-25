import { Modal } from "@/components/ui/modal";
import { PublicContentForm } from "@/components/forms/public-content-form";

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, setIsOpen }) => {
  return (
    <Modal
      title="Index a content"
      description="Fill in the details to add new content. It will then be moderated by us before being added in Hackyx. Note: it should be url of the content and not the whole blog."
      isOpen={isOpen}
      onClose={onClose}
    >
      <PublicContentForm setIsOpen={setIsOpen} />
    </Modal>
  );
};
