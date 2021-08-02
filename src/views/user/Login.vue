<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="loginErrMessage" />
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          :disabled="loginBtn"
        >{{ $t('web3.wallet.connect') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      loginBtn: false,
      isLoginError: false,
      loginErrMessage: '连接错误',
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.loginBtn = true
      this.$store.dispatch('connectWallet')
        .then(() => this.loginSuccess())
        .catch(err => this.requestFailed(err))
        .finally(() => {
          this.loginBtn = false
        })
    },
    loginSuccess () {
      this.$router.push({ path: '/' })
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.loginErrMessage = err.message || '请求出现错误，请稍后再试'
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
