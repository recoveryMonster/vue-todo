// jsx文件中不能设置样式 所以需要外部引入样式文件
import '../assets/styles/footer.styl'

export default {
  data() {
    return {
      author: 'lf'
    }
  },

  render() {
    return (
      < div class="footer" >
        <span>Learned by {this.author}</span>
      </div >
    )
  }
}

