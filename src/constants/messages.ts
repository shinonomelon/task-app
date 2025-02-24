export const MESSAGES = {
  AUTH: {
    SIGNOUT: {
      SUCCESS: 'ログアウトしました',
      FAILED: 'ログアウトに失敗しました'
    },
    SIGNUP: {
      SUCCESS: 'アカウントを作成しました',
      USER_ALLREADY_EXISTS: '既に登録されているメールアドレスです',
      FAILED: 'アカウントの作成に失敗しました'
    },
    SIGNIN: {
      SUCCESS: 'ログインしました',
      FAILED:
        'ログイン情報が正しくありません。メールアドレスとパスワードをご確認ください。'
    },
    PASSWORD_RESET_SENT: {
      SUCCESS: 'パスワードリセットメールを送信しました',
      FAILED: 'パスワードリセットメールの送信に失敗しました'
    },
    UPDATE_PASSWORD: {
      SUCCESS: 'パスワードを更新しました',
      FAILED: 'パスワードの更新に失敗しました'
    },
    VERIFY_OTP: {
      FAILED: 'メールアドレスの確認に失敗しました'
    },
    INVALID_CREDENTIALS:
      'メールまたはパスワードが違います。ご確認の上、再度ログインをお試しください',
    INVALID_TOKEN: 'トークンが無効または見つかりません',
    UNAUTHORIZED: '認証に失敗しました。再度ログインしてください。'
  },
  TASK: {
    ADD: {
      SUCCESS: 'タスクを追加しました',
      FAILED: 'タスクの追加に失敗しました'
    },
    UPDATE: {
      SUCCESS: 'タスクを編集しました',
      FAILED: 'タスクの編集に失敗しました'
    },
    DELETE: {
      SUCCESS: 'タスクを削除しました',
      FAILED: 'タスクの削除に失敗しました'
    },
    EDIT: {
      SUCCESS: 'タスクを編集しました',
      FAILED: 'タスクの編集に失敗しました'
    },
    TOGGLE: {
      SUCCESS_COMPLETE: 'タスクを完了しました',
      SUCCESS_INCOMPLETE: 'タスクを未完了にしました',
      FAILED: 'タスクの完了状態の変更に失敗しました'
    }
  },
  TAG: {
    ADD: {
      SUCCESS: 'タグを追加しました',
      FAILED: 'タグの追加に失敗しました'
    },
    DELETE: {
      SUCCESS: 'タグを削除しました',
      FAILED: 'タグの削除に失敗しました'
    }
  },
  UNEXPECTED: '予期せぬエラーが発生しました',
  VALIDATION_FAILED: 'フォームのエラーを修正してください'
} as const;
