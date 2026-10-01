import {
  ArrowLeft,
  CalendarClock,
  Check,
  ChevronDown,
  Clock3,
  CloudUpload,
  Eye,
  ImagePlus,
  LoaderCircle,
  Plus,
  Save,
  Search,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createAdminPost,
  getAdminPost,
  publishAdminPost,
  scheduleAdminPost,
  setFeaturedPost,
  updateAdminPost,
} from "./services/blog.admin.api";

import api from "../../../services/api";

import "./AdminBlogEditor.css";


const CATEGORY_OPTIONS = [
  "Migration Intelligence",
  "Migration Opportunities",
  "Country Guides",
  "Visa & Eligibility",
  "Study & Work",
  "Real Journeys",
];

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  category: "Migration Intelligence",
  tags: [],
  coverImage: {
    url: "",
    publicId: "",
  },
  status: "DRAFT",
  scheduledFor: "",
  featured: false,
  commentsEnabled: true,
  readingTime: 5,
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
  },
};


/* =========================================================
   HELPERS
========================================================= */

const getPostId = (post) =>
  post?._id ||
  post?.id ||
  "";


const normalizeDateTimeLocal = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() -
    offset * 60 * 1000,
  );

  return localDate
    .toISOString()
    .slice(0, 16);
};


const normalizePost = (post) => {
  if (!post) {
    return EMPTY_FORM;
  }

  return {
    ...EMPTY_FORM,
    ...post,

    tags: Array.isArray(post.tags)
      ? post.tags
      : [],

    coverImage: {
      url:
        post.coverImage?.url ||
        post.coverImage?.secure_url ||
        post.coverImage ||
        "",

      publicId:
        post.coverImage?.publicId ||
        post.coverImage?.public_id ||
        "",
    },

    scheduledFor:
      normalizeDateTimeLocal(
        post.scheduledFor,
      ),

    readingTime:
      Number(post.readingTime) || 5,

    seo: {
      ...EMPTY_FORM.seo,
      ...(post.seo || {}),

      keywords:
        Array.isArray(
          post.seo?.keywords,
        )
          ? post.seo.keywords
          : [],
    },
  };
};


/* =========================================================
   COMPONENT
========================================================= */

const AdminBlogEditor = () => {

  const navigate = useNavigate();

  const { postId } = useParams();

  const fileInputRef = useRef(null);

  const isEditing = Boolean(postId);


  /* =====================================================
     STATE
  ===================================================== */

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [loading, setLoading] =
    useState(isEditing);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [tagInput, setTagInput] =
    useState("");

  const [keywordInput, setKeywordInput] =
    useState("");

  const [dragActive, setDragActive] =
    useState(false);


  /* =====================================================
     LOAD
  ===================================================== */

  const loadPost = useCallback(
    async () => {

      if (!postId) {
        return;
      }

      try {

        setLoading(true);
        setError("");

        const response =
          await getAdminPost(
            postId,
          );

        const post =
          response?.data ||
          response;

        setForm(
          normalizePost(post),
        );

      } catch (loadError) {

        console.error(
          "Failed to load blog post:",
          loadError,
        );

        setError(
          loadError?.response?.data?.message ||
          loadError?.message ||
          "Unable to load this article.",
        );

      } finally {

        setLoading(false);

      }

    },
    [postId],
  );


  useEffect(() => {
    loadPost();
  }, [loadPost]);


  /* =====================================================
     FIELD HELPERS
  ===================================================== */

  const updateField = (
    field,
    value,
  ) => {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };


  const updateSeoField = (
    field,
    value,
  ) => {

    setForm((current) => ({
      ...current,

      seo: {
        ...current.seo,
        [field]: value,
      },
    }));

    setError("");
    setSuccess("");
  };


  /* =====================================================
     TAGS
  ===================================================== */

  const addTag = () => {

    const value =
      tagInput.trim();

    if (!value) {
      return;
    }

    if (
      form.tags.some(
        (tag) =>
          tag.toLowerCase() ===
          value.toLowerCase(),
      )
    ) {
      setTagInput("");
      return;
    }

    setForm((current) => ({
      ...current,

      tags: [
        ...current.tags,
        value,
      ],
    }));

    setTagInput("");
  };


  const removeTag = (
    value,
  ) => {

    setForm((current) => ({
      ...current,

      tags: current.tags.filter(
        (tag) =>
          tag !== value,
      ),
    }));
  };


  const handleTagKeyDown = (
    event,
  ) => {

    if (
      event.key === "Enter" ||
      event.key === ","
    ) {

      event.preventDefault();

      addTag();
    }
  };


  /* =====================================================
     SEO KEYWORDS
  ===================================================== */

  const addKeyword = () => {

    const value =
      keywordInput.trim();

    if (!value) {
      return;
    }

    if (
      form.seo.keywords.some(
        (keyword) =>
          keyword.toLowerCase() ===
          value.toLowerCase(),
      )
    ) {

      setKeywordInput("");

      return;
    }

    setForm((current) => ({
      ...current,

      seo: {
        ...current.seo,

        keywords: [
          ...current.seo.keywords,
          value,
        ],
      },
    }));

    setKeywordInput("");
  };


  const removeKeyword = (
    value,
  ) => {

    setForm((current) => ({
      ...current,

      seo: {
        ...current.seo,

        keywords:
          current.seo.keywords.filter(
            (keyword) =>
              keyword !== value,
          ),
      },
    }));
  };


  const handleKeywordKeyDown = (
    event,
  ) => {

    if (
      event.key === "Enter" ||
      event.key === ","
    ) {

      event.preventDefault();

      addKeyword();
    }
  };


  /* =====================================================
     CLOUDINARY UPLOAD
  ===================================================== */

  const uploadCoverImage = async (
    file,
  ) => {

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {

      setError(
        "Please select a valid image file.",
      );

      return;
    }

    if (
      file.size >
      8 * 1024 * 1024
    ) {

      setError(
        "Cover images must be 8MB or smaller.",
      );

      return;
    }

    try {

      setUploadingImage(true);

      setError("");
      setSuccess("");

      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      /*
       * Existing Colossus media endpoint.
       * Backend handles the Cloudinary upload.
       */
      const response =
        await api.post(
          "/admin/media/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          },
        );

      const uploaded =
        response?.data?.data ||
        response?.data;

      const imageUrl =
        uploaded?.url ||
        uploaded?.secure_url ||
        uploaded?.coverImage?.url ||
        "";

      const publicId =
        uploaded?.publicId ||
        uploaded?.public_id ||
        uploaded?.coverImage?.publicId ||
        "";

      if (!imageUrl) {

        throw new Error(
          "Upload completed but no Cloudinary image URL was returned.",
        );
      }

      setForm((current) => ({
        ...current,

        coverImage: {
          url: imageUrl,
          publicId,
        },
      }));

      setSuccess(
        "Cover image uploaded.",
      );

    } catch (uploadError) {

      console.error(
        "Cover image upload failed:",
        uploadError,
      );

      setError(
        uploadError?.response?.data?.message ||
        uploadError?.message ||
        "Unable to upload the cover image.",
      );

    } finally {

      setUploadingImage(false);

    }
  };


  const handleFileChange = (
    event,
  ) => {

    const file =
      event.target.files?.[0];

    if (file) {
      uploadCoverImage(file);
    }

    event.target.value = "";
  };


  const handleDrop = (
    event,
  ) => {

    event.preventDefault();

    setDragActive(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      uploadCoverImage(file);
    }
  };


  /* =====================================================
     PAYLOAD
  ===================================================== */

  const payload = useMemo(
    () => ({
      title:
        form.title.trim(),

      excerpt:
        form.excerpt.trim(),

      content:
        form.content,

      category:
        form.category,

      tags:
        form.tags,

      coverImage:
        form.coverImage,

      status:
        form.status,

      scheduledFor:
        form.scheduledFor
          ? new Date(
            form.scheduledFor,
          ).toISOString()
          : null,

      featured:
        form.featured,

      commentsEnabled:
        form.commentsEnabled,

      readingTime:
        Number(
          form.readingTime,
        ) || 5,

      seo: {
        metaTitle:
          form.seo.metaTitle.trim(),

        metaDescription:
          form.seo.metaDescription.trim(),

        keywords:
          form.seo.keywords,
      },
    }),
    [form],
  );


  /* =====================================================
     VALIDATION
  ===================================================== */

  const validate = (
    nextStatus,
  ) => {

    if (!form.title.trim()) {
      return "Article title is required.";
    }

    if (!form.content.trim()) {
      return "Article content is required.";
    }

    if (!form.category) {
      return "Please select a category.";
    }

    if (
      nextStatus === "SCHEDULED" &&
      !form.scheduledFor
    ) {

      return (
        "Choose a date and time for publication."
      );
    }

    if (
      nextStatus === "SCHEDULED" &&
      new Date(
        form.scheduledFor,
      ) <= new Date()
    ) {

      return (
        "Scheduled publication must be in the future."
      );
    }

    return "";
  };


  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async (
    nextStatus = form.status,
  ) => {

    const validationError =
      validate(nextStatus);

    if (validationError) {

      setError(
        validationError,
      );

      return;
    }

    try {

      setSaving(true);

      setError("");
      setSuccess("");

      const nextPayload = {
        ...payload,
        status: nextStatus,
      };

      let response;

      if (isEditing) {

        response =
          await updateAdminPost(
            postId,
            nextPayload,
          );

      } else {

        response =
          await createAdminPost(
            nextPayload,
          );
      }

      const savedPost =
        response?.data ||
        response;

      const savedId =
        getPostId(savedPost);

      setForm((current) => ({
        ...current,
        status: nextStatus,
      }));

      setSuccess(
        nextStatus === "PUBLISHED"
          ? "Article published successfully."
          : nextStatus === "SCHEDULED"
            ? "Article scheduled successfully."
            : "Draft saved successfully.",
      );

      if (
        !isEditing &&
        savedId
      ) {

        navigate(
          `/admin/blog/${savedId}/edit`,
          {
            replace: true,
          },
        );
      }

    } catch (saveError) {

      console.error(
        "Failed to save article:",
        saveError,
      );

      setError(
        saveError?.response?.data?.message ||
        saveError?.message ||
        "Unable to save this article.",
      );

    } finally {

      setSaving(false);

    }
  };


  /* =====================================================
     PUBLISH
  ===================================================== */

  const handlePublish = async () => {

    if (!isEditing) {

      await handleSave(
        "PUBLISHED",
      );

      return;
    }

    try {

      setSaving(true);

      setError("");
      setSuccess("");

      await publishAdminPost(
        postId,
      );

      setForm((current) => ({
        ...current,
        status: "PUBLISHED",
      }));

      setSuccess(
        "Article published successfully.",
      );

    } catch (publishError) {

      setError(
        publishError?.response?.data?.message ||
        publishError?.message ||
        "Unable to publish this article.",
      );

    } finally {

      setSaving(false);

    }
  };


  /* =====================================================
     SCHEDULE
  ===================================================== */

  const handleSchedule = async () => {

    const validationError =
      validate("SCHEDULED");

    if (validationError) {

      setError(
        validationError,
      );

      return;
    }

    if (!isEditing) {

      await handleSave(
        "SCHEDULED",
      );

      return;
    }

    try {

      setSaving(true);

      setError("");
      setSuccess("");

      await scheduleAdminPost(
        postId,
        {
          scheduledFor:
            new Date(
              form.scheduledFor,
            ).toISOString(),
        },
      );

      setForm((current) => ({
        ...current,
        status: "SCHEDULED",
      }));

      setSuccess(
        "Article scheduled successfully.",
      );

    } catch (scheduleError) {

      setError(
        scheduleError?.response?.data?.message ||
        scheduleError?.message ||
        "Unable to schedule this article.",
      );

    } finally {

      setSaving(false);

    }
  };


  /* =====================================================
     FEATURED
  ===================================================== */

  const handleFeatureToggle = async () => {

    if (!isEditing) {

      setForm((current) => ({
        ...current,
        featured:
          !current.featured,
      }));

      return;
    }

    try {

      setSaving(true);

      setError("");

      const response =
        await setFeaturedPost(
          postId,
        );

      const updatedPost =
        response?.data ||
        response;

      setForm((current) => ({
        ...current,

        featured:
          typeof updatedPost?.featured ===
            "boolean"
            ? updatedPost.featured
            : !current.featured,
      }));

    } catch (featureError) {

      setError(
        featureError?.response?.data?.message ||
        featureError?.message ||
        "Unable to update featured state.",
      );

    } finally {

      setSaving(false);

    }
  };


  /* =====================================================
     REMOVE IMAGE
  ===================================================== */

  const removeCoverImage = () => {

    setForm((current) => ({
      ...current,

      coverImage: {
        url: "",
        publicId: "",
      },
    }));

    setSuccess("");
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <main className="admin-blog-editor">

        <div className="admin-blog-editor__loading">

          <LoaderCircle
            size={24}
            className="is-spinning"
          />

          <span>
            Loading article...
          </span>

        </div>

      </main>
    );
  }


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="admin-blog-editor">

      {/* =================================================
                HEADER
            ================================================= */}

      <header className="admin-blog-editor__header">

        <div className="admin-blog-editor__header-main">

          <Link
            to="/admin/blog"
            className="admin-blog-editor__back"
          >
            <ArrowLeft size={16} />

            Journal
          </Link>

          <span className="admin-blog-editor__header-divider" />

          <div className="admin-blog-editor__heading">

            <span>
              {isEditing
                ? "Edit article"
                : "New article"}
            </span>

            <h1>
              {form.title ||
                "Untitled article"}
            </h1>

          </div>

        </div>


        <div className="admin-blog-editor__header-actions">

          <span
            className={`admin-blog-editor__status admin-blog-editor__status--${form.status.toLowerCase()}`}
          >
            <i />
            {form.status}
          </span>


          <Link
            to="/admin/blog"
            className="admin-blog-editor__button admin-blog-editor__button--ghost"
          >
            Cancel
          </Link>


          <button
            type="button"
            className="admin-blog-editor__button admin-blog-editor__button--primary"
            onClick={() =>
              handleSave("DRAFT")
            }
            disabled={
              saving ||
              uploadingImage
            }
          >
            {saving ? (
              <LoaderCircle
                size={15}
                className="is-spinning"
              />
            ) : (
              <Save size={15} />
            )}

            Save draft
          </button>

        </div>

      </header>


      {/* =================================================
                FEEDBACK
            ================================================= */}

      {(error || success) && (
        <div
          className={`admin-blog-editor__notice ${error
              ? "is-error"
              : "is-success"
            }`}
        >
          {error ? (
            <X size={15} />
          ) : (
            <Check size={15} />
          )}

          <span>
            {error || success}
          </span>
        </div>
      )}


      {/* =================================================
                WORKSPACE
            ================================================= */}

      <div className="admin-blog-editor__workspace">

        {/* =================================================
                    LEFT / CONTENT
                ================================================= */}

        <div className="admin-blog-editor__content-column">

          {/* ARTICLE */}

          <section className="editor-section">

            <div className="editor-section__header">

              <div>
                <span className="editor-section__number">
                  01
                </span>

                <div>
                  <h2>
                    Article
                  </h2>

                  <p>
                    Define the story and how it appears in the journal.
                  </p>
                </div>
              </div>

            </div>


            <div className="editor-grid editor-grid--identity">

              <div className="editor-field editor-field--wide">

                <label htmlFor="title">
                  Headline
                </label>

                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateField(
                      "title",
                      event.target.value,
                    )
                  }
                  placeholder="Write the article headline..."
                  maxLength={180}
                />

                <div className="editor-field__meta">
                  <span>
                    Primary journal headline
                  </span>

                  <span>
                    {form.title.length}/180
                  </span>
                </div>

              </div>


              <div className="editor-field">

                <label htmlFor="category">
                  Category
                </label>

                <div className="editor-select">

                  <select
                    id="category"
                    value={form.category}
                    onChange={(event) =>
                      updateField(
                        "category",
                        event.target.value,
                      )
                    }
                  >
                    {CATEGORY_OPTIONS.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ),
                    )}
                  </select>

                  <ChevronDown size={15} />

                </div>

              </div>

            </div>


            <div className="editor-field">

              <label htmlFor="excerpt">
                Excerpt
              </label>

              <textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(event) =>
                  updateField(
                    "excerpt",
                    event.target.value,
                  )
                }
                placeholder="A concise summary for article cards and previews..."
                rows={3}
                maxLength={500}
              />

              <div className="editor-field__meta">
                <span>
                  Used in journal cards and previews
                </span>

                <span>
                  {form.excerpt.length}/500
                </span>
              </div>

            </div>

          </section>


          {/* COVER */}

          <section className="editor-section">

            <div className="editor-section__header">

              <div>
                <span className="editor-section__number">
                  02
                </span>

                <div>
                  <h2>
                    Cover image
                  </h2>

                  <p>
                    Upload directly from your device. Cloudinary handles storage and delivery.
                  </p>
                </div>
              </div>


              <span className="editor-cloudinary">
                <CloudUpload size={14} />
                Cloudinary
              </span>

            </div>


            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
            />


            {form.coverImage.url ? (

              <div className="editor-media">

                <img
                  src={
                    form.coverImage.url
                  }
                  alt={
                    form.title ||
                    "Article cover"
                  }
                />

                <div className="editor-media__details">

                  <div>

                    <strong>
                      Article cover
                    </strong>

                    <span>
                      Cloudinary asset
                    </span>

                  </div>


                  <div className="editor-media__actions">

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={
                        uploadingImage
                      }
                    >
                      <Upload size={14} />
                      Replace
                    </button>

                    <button
                      type="button"
                      onClick={
                        removeCoverImage
                      }
                      className="is-danger"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ) : (

              <button
                type="button"
                className={`editor-upload ${dragActive
                    ? "is-dragging"
                    : ""
                  }`}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() =>
                  setDragActive(false)
                }
                onDrop={handleDrop}
                disabled={
                  uploadingImage
                }
              >

                <div className="editor-upload__icon">

                  {uploadingImage ? (
                    <LoaderCircle
                      size={22}
                      className="is-spinning"
                    />
                  ) : (
                    <ImagePlus
                      size={22}
                    />
                  )}

                </div>


                <div>

                  <strong>
                    {uploadingImage
                      ? "Uploading image..."
                      : "Upload cover image"}
                  </strong>

                  <span>
                    Drop an image here or{" "}
                    <b>
                      browse device
                    </b>
                  </span>

                </div>


                <small>
                  JPG, PNG, WebP or AVIF · Max 8MB
                </small>

              </button>

            )}

          </section>


          {/* CONTENT */}

          <section className="editor-section editor-section--body">

            <div className="editor-section__header">

              <div>
                <span className="editor-section__number">
                  03
                </span>

                <div>
                  <h2>
                    Content
                  </h2>

                  <p>
                    Write the full article body.
                  </p>
                </div>
              </div>


              <span className="editor-section__counter">
                {form.content.length.toLocaleString()} characters
              </span>

            </div>


            <div className="editor-body">

              <div className="editor-body__bar">

                <span>
                  ARTICLE BODY
                </span>

                <span>
                  Editorial content
                </span>

              </div>


              <textarea
                value={form.content}
                onChange={(event) =>
                  updateField(
                    "content",
                    event.target.value,
                  )
                }
                placeholder={`Start writing...

Structure the article with useful sections, context and practical information.`}
              />

            </div>

          </section>


          {/* DISCOVERY */}

          <section className="editor-section">

            <div className="editor-section__header">

              <div>
                <span className="editor-section__number">
                  04
                </span>

                <div>
                  <h2>
                    Discovery & SEO
                  </h2>

                  <p>
                    Help readers and search engines find the article.
                  </p>
                </div>
              </div>

              <Search size={17} />

            </div>


            <div className="editor-grid editor-grid--seo">

              <div className="editor-field">

                <label htmlFor="metaTitle">
                  Meta title
                </label>

                <input
                  id="metaTitle"
                  type="text"
                  value={
                    form.seo.metaTitle
                  }
                  onChange={(event) =>
                    updateSeoField(
                      "metaTitle",
                      event.target.value,
                    )
                  }
                  placeholder={
                    form.title ||
                    "SEO title"
                  }
                  maxLength={180}
                />

              </div>


              <div className="editor-field">

                <label htmlFor="readingTime">
                  Reading time
                </label>

                <div className="editor-number">

                  <Clock3 size={15} />

                  <input
                    id="readingTime"
                    type="number"
                    min="1"
                    max="120"
                    value={
                      form.readingTime
                    }
                    onChange={(event) =>
                      updateField(
                        "readingTime",
                        event.target.value,
                      )
                    }
                  />

                  <span>
                    min
                  </span>

                </div>

              </div>

            </div>


            <div className="editor-field">

              <label htmlFor="metaDescription">
                Meta description
              </label>

              <textarea
                id="metaDescription"
                value={
                  form.seo.metaDescription
                }
                onChange={(event) =>
                  updateSeoField(
                    "metaDescription",
                    event.target.value,
                  )
                }
                placeholder="Describe what readers will learn from this article..."
                rows={3}
                maxLength={320}
              />

            </div>


            <div className="editor-field">

              <label>
                Tags
              </label>

              <div className="editor-tag-input">

                <Tag size={15} />

                <input
                  type="text"
                  value={tagInput}
                  onChange={(event) =>
                    setTagInput(
                      event.target.value,
                    )
                  }
                  onKeyDown={
                    handleTagKeyDown
                  }
                  placeholder="Type a tag and press Enter..."
                />

                <button
                  type="button"
                  onClick={addTag}
                >
                  <Plus size={15} />
                </button>

              </div>


              {form.tags.length > 0 && (
                <div className="editor-tags">

                  {form.tags.map(
                    (tag) => (
                      <span
                        key={tag}
                      >
                        {tag}

                        <button
                          type="button"
                          onClick={() =>
                            removeTag(
                              tag,
                            )
                          }
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ),
                  )}

                </div>
              )}

            </div>


            <div className="editor-field">

              <label>
                SEO keywords
              </label>

              <div className="editor-tag-input">

                <Search size={15} />

                <input
                  type="text"
                  value={
                    keywordInput
                  }
                  onChange={(event) =>
                    setKeywordInput(
                      event.target.value,
                    )
                  }
                  onKeyDown={
                    handleKeywordKeyDown
                  }
                  placeholder="Type a keyword and press Enter..."
                />

                <button
                  type="button"
                  onClick={
                    addKeyword
                  }
                >
                  <Plus size={15} />
                </button>

              </div>


              {form.seo.keywords.length > 0 && (
                <div className="editor-tags editor-tags--muted">

                  {form.seo.keywords.map(
                    (keyword) => (
                      <span
                        key={keyword}
                      >
                        {keyword}

                        <button
                          type="button"
                          onClick={() =>
                            removeKeyword(
                              keyword,
                            )
                          }
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ),
                  )}

                </div>
              )}

            </div>

          </section>

        </div>


        {/* =================================================
                    RIGHT / CONTROL COLUMN
                ================================================= */}

        <aside className="admin-blog-editor__control-column">

          {/* PUBLISH */}

          <section className="control-card control-card--publish">

            <div className="control-card__header">

              <div>
                <span>
                  Publishing
                </span>

                <h2>
                  Release
                </h2>
              </div>

              <Sparkles size={16} />

            </div>


            <div className="control-status">

              <span>
                Status
              </span>

              <strong
                className={`control-status__value control-status__value--${form.status.toLowerCase()}`}
              >
                {form.status}
              </strong>

            </div>


            <button
              type="button"
              className="control-primary"
              onClick={
                handlePublish
              }
              disabled={
                saving ||
                uploadingImage
              }
            >
              {saving ? (
                <LoaderCircle
                  size={15}
                  className="is-spinning"
                />
              ) : (
                <Eye size={15} />
              )}

              Publish
            </button>


            <div className="control-schedule">

              <div className="control-schedule__label">
                <CalendarClock
                  size={14}
                />

                Schedule
              </div>

              <input
                type="datetime-local"
                value={
                  form.scheduledFor
                }
                onChange={(event) =>
                  updateField(
                    "scheduledFor",
                    event.target.value,
                  )
                }
              />

              <button
                type="button"
                onClick={
                  handleSchedule
                }
                disabled={
                  saving ||
                  uploadingImage
                }
              >
                Schedule article
              </button>

            </div>


            <button
              type="button"
              className="control-save"
              onClick={() =>
                handleSave("DRAFT")
              }
              disabled={
                saving ||
                uploadingImage
              }
            >
              <Save size={14} />

              Save draft
            </button>

          </section>


          {/* PLACEMENT */}

          <section className="control-card">

            <div className="control-card__header">

              <div>
                <span>
                  Placement
                </span>

                <h2>
                  Journal settings
                </h2>
              </div>

            </div>


            <button
              type="button"
              className="control-toggle"
              onClick={
                handleFeatureToggle
              }
              disabled={
                saving
              }
            >

              <span className="control-toggle__copy">

                <strong>
                  <Star
                    size={14}
                    fill={
                      form.featured
                        ? "currentColor"
                        : "none"
                    }
                  />

                  Featured article
                </strong>

                <small>
                  Highlight this article in the journal.
                </small>

              </span>


              <span
                className={`control-switch ${form.featured
                    ? "is-on"
                    : ""
                  }`}
              >
                <i />
              </span>

            </button>


            <div className="control-divider" />


            <button
              type="button"
              className="control-toggle"
              onClick={() =>
                updateField(
                  "commentsEnabled",
                  !form.commentsEnabled,
                )
              }
            >

              <span className="control-toggle__copy">

                <strong>
                  Comments
                </strong>

                <small>
                  Allow readers to comment.
                </small>

              </span>


              <span
                className={`control-switch ${form.commentsEnabled
                    ? "is-on"
                    : ""
                  }`}
              >
                <i />
              </span>

            </button>

          </section>


          {/* QUICK SUMMARY */}

          <section className="control-card">

            <div className="control-card__header">

              <div>
                <span>
                  Overview
                </span>

                <h2>
                  Article details
                </h2>
              </div>

            </div>


            <div className="control-details">

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {form.category}
                </strong>
              </div>


              <div>
                <span>
                  Reading time
                </span>

                <strong>
                  {form.readingTime} min
                </strong>
              </div>


              <div>
                <span>
                  Tags
                </span>

                <strong>
                  {form.tags.length}
                </strong>
              </div>


              <div>
                <span>
                  Cover
                </span>

                <strong>
                  {form.coverImage.url
                    ? "Uploaded"
                    : "Missing"}
                </strong>
              </div>

            </div>

          </section>

        </aside>

      </div>


      {/* =================================================
                FOOTER
            ================================================= */}

      <footer className="admin-blog-editor__footer">

        <Link
          to="/admin/blog"
          className="admin-blog-editor__button admin-blog-editor__button--ghost"
        >
          <ArrowLeft size={15} />

          Back to journal
        </Link>


        <div>

          <button
            type="button"
            className="admin-blog-editor__button admin-blog-editor__button--ghost"
            onClick={() =>
              handleSave("DRAFT")
            }
            disabled={
              saving ||
              uploadingImage
            }
          >
            <Save size={15} />

            Save draft
          </button>


          <button
            type="button"
            className="admin-blog-editor__button admin-blog-editor__button--primary"
            onClick={
              handlePublish
            }
            disabled={
              saving ||
              uploadingImage
            }
          >
            <Eye size={15} />

            Publish article
          </button>

        </div>

      </footer>

    </main>
  );
};


export default AdminBlogEditor;