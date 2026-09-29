import BlogComment from "../models/BlogComment.js";
import BlogPost from "../models/BlogPost.js";

/*
|--------------------------------------------------------------------------
| Public — Create Comment
|--------------------------------------------------------------------------
*/

export const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name, email, content } = req.body;

    const normalizedName = typeof name === "string" ? name.trim() : "";

    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    const normalizedContent = typeof content === "string" ? content.trim() : "";

    if (!normalizedName || !normalizedContent) {
      return res.status(400).json({
        success: false,
        message: "Name and comment are required.",
      });
    }

    const post = await BlogPost.findOne({
      _id: id,

      status: "PUBLISHED",

      publishedAt: {
        $lte: new Date(),
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    if (!post.commentsEnabled) {
      return res.status(403).json({
        success: false,
        message: "Comments are disabled for this post.",
      });
    }

    const comment = await BlogComment.create({
      post: post._id,

      name: normalizedName,

      email: normalizedEmail,

      content: normalizedContent,

      status: "PENDING",

      isEditorial: false,
    });

    return res.status(201).json({
      success: true,

      message: "Comment submitted for review.",

      data: {
        id: comment._id,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Admin — Get Comments
|--------------------------------------------------------------------------
*/

export const getComments = async (req, res, next) => {
  try {
    const { status, post, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (post) {
      filter.post = post;
    }

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [comments, total] = await Promise.all([
      BlogComment.find(filter)
        .populate("post", "title slug")
        .populate("createdBy", "name email role")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber),

      BlogComment.countDocuments(filter),
    ]);

    return res.json({
      success: true,

      data: comments,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Admin — Create Editorial Comment
|--------------------------------------------------------------------------
*/

export const createEditorialComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      content,
      status = "APPROVED",
      scheduledFor,
      pinned = false,
    } = req.body;

    const normalizedContent = typeof content === "string" ? content.trim() : "";

    if (!normalizedContent) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required.",
      });
    }

    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    const commentStatus = status === "SCHEDULED" ? "SCHEDULED" : "APPROVED";

    let normalizedScheduledFor = null;

    let publishedAt = null;

    if (commentStatus === "SCHEDULED") {
      if (!scheduledFor) {
        return res.status(400).json({
          success: false,
          message: "scheduledFor is required for scheduled comments.",
        });
      }

      normalizedScheduledFor = new Date(scheduledFor);

      if (Number.isNaN(normalizedScheduledFor.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid scheduled date.",
        });
      }

      if (normalizedScheduledFor <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled date must be in the future.",
        });
      }
    } else {
      publishedAt = new Date();
    }

    const normalizedName =
      typeof name === "string" && name.trim()
        ? name.trim()
        : req.user?.name || "Colossus";

    const normalizedEmail =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : req.user?.email || "";

    const comment = await BlogComment.create({
      post: post._id,

      name: normalizedName,

      email: normalizedEmail,

      content: normalizedContent,

      status: commentStatus,

      scheduledFor: normalizedScheduledFor,

      publishedAt,

      pinned: Boolean(pinned),

      isEditorial: true,

      createdBy: req.user?._id || req.user?.id || null,
    });

    return res.status(201).json({
      success: true,

      message:
        commentStatus === "SCHEDULED"
          ? "Editorial comment scheduled."
          : "Editorial comment published.",

      data: comment,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Admin — Update Comment
|--------------------------------------------------------------------------
*/

export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const allowedFields = ["name", "email", "content", "pinned"];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] === "string") {
          updates[field] = req.body[field].trim();

          if (field === "email") {
            updates[field] = updates[field].toLowerCase();
          }
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    const comment = await BlogComment.findByIdAndUpdate(commentId, updates, {
      new: true,
      runValidators: true,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    return res.json({
      success: true,
      message: "Comment updated.",
      data: comment,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Admin — Delete Comment
|--------------------------------------------------------------------------
*/

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await BlogComment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    return res.json({
      success: true,
      message: "Comment deleted.",
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Admin — Approve Comment
|--------------------------------------------------------------------------
*/

export const approveComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await BlogComment.findByIdAndUpdate(
      commentId,
      {
        status: "APPROVED",
        publishedAt: new Date(),
        scheduledFor: null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    return res.json({
      success: true,
      message: "Comment approved.",
      data: comment,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Admin — Reject Comment
|--------------------------------------------------------------------------
*/

export const rejectComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await BlogComment.findByIdAndUpdate(
      commentId,
      {
        status: "REJECTED",
        scheduledFor: null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    return res.json({
      success: true,
      message: "Comment rejected.",
      data: comment,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Admin — Schedule Comment
|--------------------------------------------------------------------------
*/

export const scheduleComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const { scheduledFor } = req.body;

    if (!scheduledFor) {
      return res.status(400).json({
        success: false,
        message: "scheduledFor is required.",
      });
    }

    const scheduleDate = new Date(scheduledFor);

    if (Number.isNaN(scheduleDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled date.",
      });
    }

    if (scheduleDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date must be in the future.",
      });
    }

    const comment = await BlogComment.findByIdAndUpdate(
      commentId,
      {
        status: "SCHEDULED",
        scheduledFor: scheduleDate,
        publishedAt: null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    return res.json({
      success: true,
      message: "Comment scheduled successfully.",
      data: comment,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Admin — Toggle Pin
|--------------------------------------------------------------------------
*/

export const togglePinComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await BlogComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    comment.pinned = !comment.pinned;

    await comment.save();

    return res.json({
      success: true,

      message: comment.pinned ? "Comment pinned." : "Comment unpinned.",

      data: comment,
    });
  } catch (error) {
    return next(error);
  }
};
