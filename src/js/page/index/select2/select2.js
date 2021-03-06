import pinyin from './pinyin';
import {
  axios
} from '../../common/axios';

let matchStart = (term, text) => {
  term = term.toUpperCase();
  if (pinyin.toPinYin(text).includes(term) || pinyin.toPinYinFull(text).toUpperCase().includes(term)) {
    return true;
  }
  return text.toUpperCase().includes(term);
}

let init = () => {
  $.fn.select2.defaults.set("theme", "bootstrap");

  $(".select2-allow-clear").select2({
    allowClear: true,
    width: null
  });

  $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
    $(".select2, .select2-multiple").select2({
      matcher: oldMatcher(matchStart),
      width: null,
    });
  });
}

// 获取select2值
let value = (name, val) => $("select[name='" + name + "']").select2('val', [val]);

// 重置值为空
let reset = name => value(name, '');

// 根据name获取select2文本内容
let text = name => {
  let arr = [];
  $("select[name='" + name + "']").find('option:selected').each(function () {
    arr.push(this.text);
  });
  return arr.join(',');
}

// 使用select2方法加载数据
// https://select2.org/data-sources/arrays
let render = (name, data) => {
  let dom = $("select[name='" + name + "']");
  data = [{
    id: "",
    text: ""
  }, ...data];
  dom.select2({
    data
  })
  // let html = getHtml(data);
  // dom.html(html);
  // console.log(html)
}

// https://select2.org/data-sources/ajax
let renderWithUrl = async (name, url) => {
  let data = await axios({
    url
  }).then(res => res.data);
  render(name, data);
}

let getHtml = data => {
  data = [{
    text: "",
    id: ""
  }, ...data];
  return data.map(item => `<option value="${item.id}">${item.text}</option>`).join('');
}

export default {
  init,
  value,
  reset,
  text,
  render,
  renderWithUrl
}
